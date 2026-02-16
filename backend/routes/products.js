const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET all products (public) - optional query ?category=CategoryName
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category.trim() !== '') {
      filter.category = req.query.category.trim();
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create product (admin only)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Si une image a été uploadée, utiliser son chemin
    if (req.file) {
      productData.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image && req.body.image.trim() !== '') {
      // Si c'est une URL, la garder telle quelle
      productData.image = req.body.image;
    } else {
      return res.status(400).json({ message: 'Image is required' });
    }
    
    // Parser les matériaux si c'est une string JSON
    if (typeof productData.materials === 'string') {
      try {
        productData.materials = JSON.parse(productData.materials);
      } catch (e) {
        // Si ce n'est pas du JSON, garder tel quel
      }
    }
    
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update product (admin only)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Si une nouvelle image a été uploadée, utiliser son chemin
    if (req.file) {
      productData.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image && req.body.image.trim() !== '') {
      // Si c'est une URL, la garder telle quelle
      productData.image = req.body.image;
    }
    // Si aucune image n'est fournie, garder l'ancienne (ne pas mettre à jour)
    
    // Parser les matériaux si c'est une string JSON
    if (typeof productData.materials === 'string') {
      try {
        productData.materials = JSON.parse(productData.materials);
      } catch (e) {
        // Si ce n'est pas du JSON, garder tel quel
      }
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE product (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
