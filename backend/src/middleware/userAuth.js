const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect user routes
const protectUser = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Must be a user token (not admin)
    if (decoded.role === 'admin' || decoded.role === 'superadmin') {
      return res.status(403).json({ success: false, message: 'Không được phép' });
    }
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại hoặc đã bị khoá' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
const optionalUserAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return next();
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'admin' || decoded.role === 'superadmin') {
      return next();
    }
    const user = await User.findById(decoded.id).select('-password');
    if (user && user.isActive) {
      req.user = user;
    }
    next();
  } catch (err) {
    next();
  }
};

module.exports = { protectUser, optionalUserAuth };
