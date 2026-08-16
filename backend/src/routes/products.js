const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { optionalUserAuth } = require('../middleware/userAuth');

// Public: GET all products
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };
    if (category) query.$or = [{ categoryVi: new RegExp(category, 'i') }, { categoryEn: new RegExp(category, 'i') }];
    const products = await Product.find(query, '-priceRequests').sort({ order: 1 });
    res.json({ success: true, data: products });
  } catch (err) { next(err); }
});

// Public: GET product by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }, '-priceRequests');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
});

// Public: Submit price request
router.post('/:slug/quote', optionalUserAuth, async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    product.priceRequests.push(req.body);
    await product.save();

    // Create a Contact record for Admin Inbox
    const Contact = require('../models/Contact');
    await Contact.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      message: req.body.message,
      service: 'Yêu cầu báo giá: ' + product.nameVi,
      lang: req.body.lang || 'vi'
    });

    if (req.user) {
      req.user.quoteRequests.push({
        product: product.nameVi,
        quantity: req.body.quantity,
        message: req.body.message,
      });
      await req.user.save();
    }

    res.status(201).json({ success: true, message: 'Quote request submitted' });
  } catch (err) { next(err); }
});

// Admin: GET all
router.get('/admin/all', protect, async (req, res, next) => {
  try {
    const products = await Product.find().sort({ order: 1 });
    res.json({ success: true, data: products });
  } catch (err) { next(err); }
});

// Admin: CREATE
router.post('/', protect, async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) { next(err); }
});

// Admin: UPDATE
router.put('/:id', protect, async (req, res, next) => {
  try {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ success: false, message: 'Product not found' });

    if (req.body.order !== undefined && Number(req.body.order) !== existingProduct.order) {
      const newOrder = Number(req.body.order);
      const conflictProduct = await Product.findOne({ order: newOrder, _id: { $ne: existingProduct._id } });
      if (conflictProduct) {
        conflictProduct.order = existingProduct.order;
        await conflictProduct.save();
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
});

// Admin: DELETE
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
