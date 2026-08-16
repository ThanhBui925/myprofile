const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');
const { protectUser } = require('../middleware/userAuth');

// Submit contact
router.post('/', protectUser, async (req, res, next) => {
  try {
    const { name, email, phone, company, service, message, lang } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }
    const contact = await Contact.create({ name, email, phone, company, service, message, lang });
    
    if (req.user) {
      req.user.consultations.push({
        service: service || 'Tư vấn chung',
        message: message,
      });
      await req.user.save();
    }

    res.status(201).json({ success: true, message: 'Message sent successfully', data: contact });
  } catch (err) { next(err); }
});

// Admin: GET all contacts
router.get('/', protect, async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const contacts = await Contact.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: contacts, total: contacts.length });
  } catch (err) { next(err); }
});

// Admin: Update status
router.put('/:id', protect, async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, data: contact });
  } catch (err) { next(err); }
});

// Admin: DELETE
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
