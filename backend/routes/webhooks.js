const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Order = require('../models/Order');

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * POST /api/webhooks/stripe
 * Raw body required for signature verification. Mount with express.raw({ type: 'application/json' })
 * Creates order in DB only when payment is confirmed (checkout.session.completed).
 */
const handleStripeWebhook = async (req, res) => {
  if (!stripe || !webhookSecret) {
    return res.status(503).send('Webhook not configured');
  }
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const sessionRaw = event.data.object;
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionRaw.id, { expand: ['payment_intent'] });
      const items = session.metadata?.items_json ? JSON.parse(session.metadata.items_json) : [];
      const total = session.amount_total ? session.amount_total / 100 : parseFloat(session.metadata?.total || 0);
      const currency = (session.metadata?.currency || session.currency || 'eur').toUpperCase();
      const paymentIntentId = session.payment_intent
        ? (typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id)
        : null;
      const userId = session.metadata?.user_id || null;

      await Order.create({
        user_id: userId,
        total,
        currency,
        payment_method: 'Stripe',
        payment_status: 'paid',
        stripe_payment_intent_id: paymentIntentId,
        stripe_session_id: session.id,
        paypal_order_id: null,
        shipping_status: 'pending',
        tracking_number: '',
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image || ''
        })),
        customer_email: session.metadata?.customer_email || session.customer_email || session.customer_details?.email || null
      });
    } catch (err) {
      console.error('Order create from webhook failed:', err);
      return res.status(500).send('Order creation failed');
    }
  }

  res.send();
};

router.post('/stripe', handleStripeWebhook);
module.exports = router;
