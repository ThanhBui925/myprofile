const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Contact = require('../models/Contact');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Product = require('../models/Product');
const User = require('../models/User');

// Dashboard stats
router.get('/dashboard', protect, async (req, res, next) => {
  try {
    const [contacts, services, projects, products, newContacts, users] = await Promise.all([
      Contact.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Project.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true }),
      Contact.countDocuments({ status: 'new' }),
      User.countDocuments({ isActive: true }),
    ]);
    res.json({
      success: true,
      data: { contacts, services, projects, products, newContacts, users }
    });
  } catch (err) { next(err); }
});

module.exports = router;
