const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');

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

// All routes require admin auth
router.use(authMiddleware);

/**
 * GET /api/orders
 * List all orders (newest first).
 */
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ created_at: -1 })
      .lean();
    return res.json(orders);
  } catch (err) {
    console.error('List orders error:', err);
    return res.status(500).json({ message: 'Failed to list orders' });
  }
});

/**
 * GET /api/orders/:id
 * Get one order by id.
 */
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json(order);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(500).json({ message: 'Failed to get order' });
  }
});

/**
 * PATCH /api/orders/:id
 * Update only shipping_status and tracking_number. payment_status must NEVER be set here.
 */
router.patch('/:id', async (req, res) => {
  try {
    const { shipping_status, tracking_number } = req.body;
    const update = {};
    if (shipping_status !== undefined) update.shipping_status = String(shipping_status).trim();
    if (tracking_number !== undefined) update.tracking_number = String(tracking_number).trim();

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json(order);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(500).json({ message: 'Failed to update order' });
  }
});

/**
 * POST /api/orders/:id/refund
 * Trigger refund via Stripe or PayPal API. Updates order payment_status to 'refunded' only after API success.
 */
router.post('/:id/refund', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.payment_status === 'refunded') {
      return res.status(400).json({ message: 'Order already refunded' });
    }
    if (order.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Only paid orders can be refunded' });
    }

    if (order.payment_method === 'Stripe') {
      if (!stripe) {
        return res.status(503).json({ message: 'Stripe is not configured' });
      }
      const paymentIntentId = order.stripe_payment_intent_id;
      if (!paymentIntentId) {
        return res.status(400).json({ message: 'No Stripe payment intent for this order' });
      }
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        reason: 'requested_by_customer'
      });
      if (refund.status !== 'succeeded' && refund.status !== 'pending') {
        return res.status(502).json({ message: 'Stripe refund failed' });
      }
      order.payment_status = 'refunded';
      await order.save();
      return res.json({ success: true, message: 'Refund initiated', order });
    }

    if (order.payment_method === 'PayPal') {
      if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
        return res.status(503).json({ message: 'PayPal is not configured' });
      }
      const captureId = order.paypal_capture_id || await getPayPalCaptureId(order.paypal_order_id);
      if (!captureId) {
        return res.status(400).json({ message: 'No PayPal capture ID for this order' });
      }
      const token = await getPayPalAccessToken();
      const refundRes = await fetch(
        `${PAYPAL_API_BASE}/v2/payments/captures/${captureId}/refund`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            amount: { value: String(order.total), currency_code: order.currency }
          })
        }
      );
      const refundData = await refundRes.json();
      if (!refundRes.ok) {
        return res.status(502).json({
          message: refundData.message || refundData.details?.[0]?.description || 'PayPal refund failed'
        });
      }
      order.payment_status = 'refunded';
      await order.save();
      return res.json({ success: true, message: 'Refund initiated', order });
    }

    return res.status(400).json({ message: 'Unknown payment method' });
  } catch (err) {
    console.error('Refund error:', err);
    return res.status(500).json({ message: err.message || 'Refund failed' });
  }
});

async function getPayPalCaptureId(paypalOrderId) {
  if (!paypalOrderId) return null;
  try {
    const token = await getPayPalAccessToken();
    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const captureId = data.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    return captureId || null;
  } catch {
    return null;
  }
}

module.exports = router;
