const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// Public: GET projects with filters
router.get('/', async (req, res, next) => {
  try {
    const { industry, technology, client, featured, limit } = req.query;
    const query = { isActive: true, isNDA: false };
    if (industry) query.$or = [{ industryVi: new RegExp(industry, 'i') }, { industryEn: new RegExp(industry, 'i') }];
    if (technology) query.technologies = { $in: [new RegExp(technology, 'i')] };
    if (client) query.client = new RegExp(client, 'i');
    if (featured === 'true') query.isFeatured = true;

    let q = Project.find(query, '-priceRequests').sort({ order: 1, createdAt: -1 });
    if (limit) q = q.limit(parseInt(limit));
    const projects = await q;
    res.json({ success: true, data: projects });
  } catch (err) { next(err); }
});

// Public: GET project by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, isActive: true, isNDA: false });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
});

// Admin: GET ALL (including NDA)
router.get('/admin/all', protect, async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) { next(err); }
});

// Admin: CREATE
router.post('/', protect, async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) { next(err); }
});

// Admin: UPDATE
router.put('/:id', protect, async (req, res, next) => {
  try {
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) return res.status(404).json({ success: false, message: 'Project not found' });

    if (req.body.order !== undefined && Number(req.body.order) !== existingProject.order) {
      const newOrder = Number(req.body.order);
      const conflictProject = await Project.findOne({ order: newOrder, _id: { $ne: existingProject._id } });
      if (conflictProject) {
        conflictProject.order = existingProject.order;
        await conflictProject.save();
      }
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
});

// Admin: DELETE
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
