const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const partners = await Partner.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: partners });
  } catch (err) { next(err); }
});

router.get('/all', protect, async (req, res, next) => {
  try {
    const partners = await Partner.find().sort({ order: 1 });
    res.json({ success: true, data: partners });
  } catch (err) { next(err); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const partner = await Partner.create(req.body);
    res.status(201).json({ success: true, data: partner });
  } catch (err) { next(err); }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const existingPartner = await Partner.findById(req.params.id);
    if (!existingPartner) return res.status(404).json({ success: false, message: 'Partner not found' });

    if (req.body.order !== undefined && Number(req.body.order) !== existingPartner.order) {
      const newOrder = Number(req.body.order);
      const conflictPartner = await Partner.findOne({ order: newOrder, _id: { $ne: existingPartner._id } });
      if (conflictPartner) {
        conflictPartner.order = existingPartner.order;
        await conflictPartner.save();
      }
    }

    const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: partner });
  } catch (err) { next(err); }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Partner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
