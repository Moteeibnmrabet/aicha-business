const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Order = require('../models/Order');
const { requireCustomerAuth } = require('../middleware/customerAuth');

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`
    },
    body: 'grant_type=client_credentials'
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || 'PayPal auth failed');
  }
  return data.access_token;
}

/**
 * POST /api/checkout/create-checkout-session
 * Requires Auth: user must be logged in
 * Body: { items: [{ productId, name, price, quantity, image? }], currency?, successUrl?, cancelUrl? }
 * Returns: { url } for Stripe Checkout redirect. Order is created only via webhook after payment.
 */
router.post('/create-checkout-session', requireCustomerAuth, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ message: 'Stripe is not configured' });
  }
  try {
    const { items, currency = 'eur', successUrl, cancelUrl } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required' });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: (currency || 'eur').toLowerCase(),
        unit_amount: Math.round(parseFloat(item.price) * 100),
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : []
        }
      },
      quantity: Math.max(1, parseInt(item.quantity, 10) || 1)
    }));

    const total = items.reduce((sum, i) => sum + parseFloat(i.price) * (parseInt(i.quantity, 10) || 1), 0);
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: successUrl || `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/cancel`,
      metadata: {
        items_json: JSON.stringify(items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: parseFloat(i.price),
          quantity: parseInt(i.quantity, 10) || 1,
          image: i.image || ''
        }))),
        total: String(total),
        currency: (currency || 'eur').toUpperCase(),
        user_id: req.user._id.toString(),
        customer_email: req.user.email
      }
    });

    return res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Create checkout session error:', err);
    return res.status(500).json({ message: err.message || 'Failed to create checkout session' });
  }
});

/**
 * POST /api/checkout/create-paypal-order
 * Requires Auth: user must be logged in
 * Body: { items: [{ productId, name, price, quantity }], currency? }
 * Returns: { orderId } for PayPal JS SDK. Order in DB is created only on capture.
 */
router.post('/create-paypal-order', requireCustomerAuth, async (req, res) => {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return res.status(503).json({ message: 'PayPal is not configured' });
  }
  try {
    const { items, currency = 'eur' } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required' });
    }

    const total = items.reduce((sum, i) => sum + parseFloat(i.price) * (parseInt(i.quantity, 10) || 1), 0);
    const currencyCode = (currency || 'eur').toUpperCase();
    const token = await getPayPalAccessToken();

    const paypalOrder = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currencyCode,
          value: total.toFixed(2)
        },
        items: items.map((i) => ({
          name: (i.name || '').substring(0, 127),
          unit_amount: { currency_code: currencyCode, value: parseFloat(i.price).toFixed(2) },
          quantity: String(Math.max(1, parseInt(i.quantity, 10) || 1))
        }))
      }]
    };

    const createRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(paypalOrder)
    });
    const data = await createRes.json();
    if (!createRes.ok || !data.id) {
      throw new Error(data.message || data.details?.[0]?.description || 'PayPal create order failed');
    }

    return res.json({ orderId: data.id });
  } catch (err) {
    console.error('Create PayPal order error:', err);
    return res.status(500).json({ message: err.message || 'Failed to create PayPal order' });
  }
});

/**
 * POST /api/checkout/capture-paypal-order
 * Requires Auth: user must be logged in
 * Body: { orderId, items, total, currency }
 * Captures the PayPal order and creates Order in DB (payment confirmed).
 */
router.post('/capture-paypal-order', requireCustomerAuth, async (req, res) => {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return res.status(503).json({ message: 'PayPal is not configured' });
  }
  try {
    const { orderId, items, total, currency } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    const token = await getPayPalAccessToken();
    const captureRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({})
    });
    const data = await captureRes.json();
    if (!captureRes.ok || data.status !== 'COMPLETED') {
      throw new Error(data.message || data.details?.[0]?.description || 'PayPal capture failed');
    }

    const purchaseUnit = data.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];
    const captureId = capture?.id || null;
    const amount = capture?.amount;
    const paidTotal = amount ? parseFloat(amount.value) : (total ? parseFloat(total) : 0);
    const paidCurrency = (amount?.currency_code || currency || 'eur').toUpperCase();
    const orderItems = Array.isArray(items) && items.length > 0
      ? items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: parseFloat(i.price),
          quantity: parseInt(i.quantity, 10) || 1,
          image: i.image || ''
        }))
      : [];

    await Order.create({
      user_id: req.user._id,
      total: paidTotal,
      currency: paidCurrency,
      payment_method: 'PayPal',
      payment_status: 'paid',
      stripe_payment_intent_id: null,
      stripe_session_id: null,
      paypal_order_id: orderId,
      paypal_capture_id: captureId,
      shipping_status: 'pending',
      tracking_number: '',
      items: orderItems,
      customer_email: req.user.email
    });

    return res.json({ success: true, orderId: data.id });
  } catch (err) {
    console.error('Capture PayPal order error:', err);
    return res.status(500).json({ message: err.message || 'Failed to capture PayPal order' });
  }
});

module.exports = router;
