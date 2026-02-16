const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET settings (public) - retourne un seul document
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT settings (admin only)
router.put('/', authMiddleware, upload.fields([
  { name: 'heroImage', maxCount: 1 }
]), async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings({});
    }

    const body = { ...req.body };

    if (req.files && req.files.heroImage && req.files.heroImage[0]) {
      body.heroImage = `/uploads/${req.files.heroImage[0].filename}`;
    }

    if (body.philosophyParagraphs && typeof body.philosophyParagraphs === 'string') {
      try {
        body.philosophyParagraphs = JSON.parse(body.philosophyParagraphs);
      } catch (e) {
        body.philosophyParagraphs = body.philosophyParagraphs.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
      }
    }

    if (body.paymentMethods && typeof body.paymentMethods === 'string') {
      try {
        body.paymentMethods = JSON.parse(body.paymentMethods);
      } catch (e) {
        body.paymentMethods = body.paymentMethods.split(',').map(p => p.trim()).filter(Boolean);
      }
    }

    Object.assign(settings, body);
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
