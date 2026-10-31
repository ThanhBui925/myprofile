const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      console.log('Auth error: No token provided for ' + req.originalUrl);
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      console.log('Auth error: Admin not found or inactive for ' + req.originalUrl);
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    req.admin = admin;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      console.log('Auth error: Token invalid or expired for ' + req.originalUrl, err.message);
      return res.status(401).json({ success: false, message: 'Token invalid or expired' });
    }
    console.error('Database/Server error during auth for ' + req.originalUrl, err);
    return res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
};

const superAdmin = (req, res, next) => {
  if (req.admin.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Forbidden: Superadmin only' });
  }
  next();
};

module.exports = { protect, superAdmin };
