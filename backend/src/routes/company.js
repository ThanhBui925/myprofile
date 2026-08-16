const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect } = require('../middleware/auth');

// Public: GET company info
router.get('/', async (req, res, next) => {
  try {
    let company = await Company.findOne();
    if (company && (!company.addressVi || !company.addressEn)) {
      company.addressVi = company.addressVi || company.address || 'Trần Xá, KCN Yên Phong, Bắc Ninh';
      company.addressEn = company.addressEn || 'Tran Xa, Yen Phong Industrial Park, Bac Ninh';
      await company.save();
    }
    res.json({ success: true, data: company });
  } catch (err) { next(err); }
});

// Admin: UPDATE company info
router.put('/', protect, async (req, res, next) => {
  try {
    let company = await Company.findOne();
    if (company) {
      company = await Company.findByIdAndUpdate(company._id, req.body, { new: true, runValidators: true });
    } else {
      company = await Company.create(req.body);
    }
    res.json({ success: true, data: company });
  } catch (err) { next(err); }
});

module.exports = router;
