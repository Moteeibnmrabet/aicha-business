const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  // Hero
  heroImage: { type: String, default: '' },
  heroTitle: { type: String, default: "L'Art de l'Essentiel" },
  heroSubtitle: { type: String, default: '' },
  heroButtonText: { type: String, default: 'Explorer' },

  // Philosophie
  philosophyTitle: { type: String, default: 'Notre Philosophie' },
  philosophyParagraphs: [{ type: String }],

  // Livraison & Paiement
  shippingTitle: { type: String, default: 'Livraison mondiale' },
  shippingText: { type: String, default: 'Nous expédions partout dans le monde. Délais indicatifs : 5-10 jours ouvrés en Europe, 10-15 jours pour le reste du monde. Les frais de port sont calculés à la caisse.' },
  paymentTitle: { type: String, default: 'Paiement sécurisé' },
  paymentText: { type: String, default: 'Paiement 100 % sécurisé par carte bancaire ou PayPal. Vos données sont protégées.' },
  paymentMethods: [{ type: String }], // ex: ['Visa', 'Mastercard', 'PayPal']

  // Footer
  footerTitle: { type: String, default: 'Restez informé' },
  footerSubtitle: { type: String, default: 'Recevez nos dernières collections et actualités' },
  copyrightText: { type: String, default: '© 2024 Aicha Business. Tous droits réservés.' },

  updatedAt: { type: Date, default: Date.now }
});

siteSettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
