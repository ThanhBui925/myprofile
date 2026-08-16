const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');
const { optionalUserAuth } = require('../middleware/userAuth');

// Public: GET all services
router.get('/', async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true }, '-consultationRequests').sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (err) { next(err); }
});

// Public: GET service by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true }, '-consultationRequests');
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (err) { next(err); }
});

// Public: Submit consultation request
router.post('/:slug/consult', optionalUserAuth, async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    
    // Push to service's internal array (optional, but keeping it for backward compatibility)
    service.consultationRequests.push(req.body);
    await service.save();

    // Also create a Contact record so it appears in the Admin's Global Contact Inbox
    const Contact = require('../models/Contact');
    await Contact.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      message: req.body.message,
      service: service.nameVi,
      lang: req.body.lang || 'vi'
    });

    if (req.user) {
      req.user.consultations.push({
        service: service.nameVi,
        message: req.body.message,
      });
      await req.user.save();
    }

    res.status(201).json({ success: true, message: 'Request submitted successfully' });
  } catch (err) { next(err); }
});

// Admin: GET all (with consultation requests)
router.get('/admin/all', protect, async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (err) { next(err); }
});

// Admin: CREATE
router.post('/', protect, async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err) { next(err); }
});

// Admin: UPDATE
router.put('/:id', protect, async (req, res, next) => {
  try {
    const existingService = await Service.findById(req.params.id);
    if (!existingService) return res.status(404).json({ success: false, message: 'Service not found' });

    // Handle order swapping if order is changed
    if (req.body.order !== undefined && Number(req.body.order) !== existingService.order) {
      const newOrder = Number(req.body.order);
      const conflictService = await Service.findOne({ order: newOrder, _id: { $ne: existingService._id } });
      
      if (conflictService) {
        // Swap: update conflicting service to current service's old order
        conflictService.order = existingService.order;
        await conflictService.save();
      }
    }

    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: service });
  } catch (err) { next(err); }
});

// Admin: DELETE
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
