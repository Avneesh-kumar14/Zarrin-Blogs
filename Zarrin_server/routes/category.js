const express = require('express');
const { auth, admin } = require('../middleware/auth');
const Category = require('../models/blogCategory');

const router = express.Router();

// Get total count of categories
router.get('/count', auth, async (req, res) => {
  try {
    const count = await Category.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create category (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const slug = name.replace(/\s+/g, '_').toLowerCase();
    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update category (admin only)
router.patch('/:id', auth, admin, async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    category.name = name || category.name;
    category.slug = (name || category.name).replace(/\s+/g, '_').toLowerCase();
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete category (auth required, admin preferred)
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
