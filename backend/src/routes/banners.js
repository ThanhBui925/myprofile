const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { protect } = require('../middleware/auth');

// Public: GET all active banners
router.get('/', async (req, res, next) => {
  try {
    let banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    if (banners.length === 0) {
      const defaultBanner = await Banner.create({
        titleVi: 'Tài Liệu Tự Động Hóa\nMiễn Phí',
        titleEn: 'Free Automation\nDocumentation',
        subtitleVi: 'Cung cấp kho tài liệu tự động hoá, sơ đồ mạch điện và tài liệu kỹ thuật hoàn toàn miễn phí từ THANHTDH.',
        subtitleEn: 'Providing free automation technical documentation, electrical schematics, and resources from THANHTDH.',
        order: 1,
        isActive: true
      });
      banners = [defaultBanner];
    }
    res.json({ success: true, data: banners });
  } catch (err) { next(err); }
});

// Admin: GET all banners
router.get('/all', protect, async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.json({ success: true, data: banners });
  } catch (err) { next(err); }
});

// Admin: CREATE
router.post('/', protect, async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, data: banner });
  } catch (err) { next(err); }
});

// Admin: UPDATE
router.put('/:id', protect, async (req, res, next) => {
  try {
    const existingBanner = await Banner.findById(req.params.id);
    if (!existingBanner) return res.status(404).json({ success: false, message: 'Banner not found' });

    // Handle order swapping
    if (req.body.order !== undefined && Number(req.body.order) !== existingBanner.order) {
      const newOrder = Number(req.body.order);
      const conflictBanner = await Banner.findOne({ order: newOrder, _id: { $ne: existingBanner._id } });
      if (conflictBanner) {
        conflictBanner.order = existingBanner.order;
        await conflictBanner.save();
      }
    }

    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: banner });
  } catch (err) { next(err); }
});

// Admin: DELETE
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
