const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'eur',
    uppercase: true
  },
  payment_method: {
    type: String,
    required: true,
    enum: ['Stripe', 'PayPal']
  },
  payment_status: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  stripe_payment_intent_id: { type: String, default: null },
  stripe_session_id: { type: String, default: null },
  paypal_order_id: { type: String, default: null },
  paypal_capture_id: { type: String, default: null },
  shipping_status: {
    type: String,
    default: 'pending',
    trim: true
  },
  tracking_number: {
    type: String,
    default: '',
    trim: true
  },
  items: [orderItemSchema],
  customer_email: { type: String, trim: true },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

orderSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

// Index for admin listing
orderSchema.index({ created_at: -1 });
orderSchema.index({ payment_status: 1 });

module.exports = mongoose.model('Order', orderSchema);
