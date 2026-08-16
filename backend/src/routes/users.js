const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protectUser } = require('../middleware/userAuth');

const signToken = (id) =>
  jwt.sign({ id, type: 'user' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });

// ─── POST /api/users/register ─────────────────────────────────────────────────
router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, password, phone, company } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    // Check duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email này đã được đăng ký' });
    }

    const user = await User.create({ fullName, email, password, phone, company });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/users/login ────────────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Tài khoản đã bị khoá. Vui lòng liên hệ hỗ trợ.' });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
});
// ─── POST /api/users/google ───────────────────────────────────────────────────
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res, next) => {
  try {
    const { token, access_token } = req.body;
    let googleId, email, fullName, avatar;

    if (token) {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      googleId = payload.sub;
      email = payload.email;
      fullName = payload.name;
      avatar = payload.picture;
    } else if (access_token) {
      const resUser = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const userData = await resUser.json();
      googleId = userData.sub;
      email = userData.email;
      fullName = userData.name;
      avatar = userData.picture;
    } else {
      return res.status(400).json({ success: false, message: 'Google token is required' });
    }

    // Check if user already exists
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // If user exists but doesn't have googleId (signed up via email previously), link it
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.avatar) user.avatar = avatar; // optional: update avatar if empty
        await user.save();
      }
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Tài khoản đã bị khoá. Vui lòng liên hệ hỗ trợ.' });
      }
    } else {
      // Create new user
      user = await User.create({
        googleId,
        email,
        fullName,
        avatar,
        // password is omitted, so it won't be set
      });
    }

    const jwtToken = signToken(user._id);

    res.json({
      success: true,
      message: 'Đăng nhập Google thành công!',
      token: jwtToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(401).json({ success: false, message: 'Xác thực Google thất bại' });
  }
});

// ─── POST /api/users/facebook ─────────────────────────────────────────────────
router.post('/facebook', async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ success: false, message: 'Facebook access token is required' });
    }

    // Verify token and get user info from Facebook Graph API
    const fbResponse = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id,name,email,picture.width(200).height(200)&access_token=${accessToken}`
    );
    const fbData = await fbResponse.json();

    if (fbData.error) {
      console.error('Facebook Auth Error:', fbData.error);
      return res.status(401).json({ success: false, message: 'Xác thực Facebook thất bại' });
    }

    const { id: facebookId, name: fullName, email, picture } = fbData;
    const avatar = picture?.data?.url || '';

    // Facebook may not return email if user hasn't granted permission
    const searchCriteria = email
      ? { $or: [{ facebookId }, { email }] }
      : { facebookId };

    let user = await User.findOne(searchCriteria);

    if (user) {
      // Link Facebook account if not already linked
      if (!user.facebookId) {
        user.facebookId = facebookId;
        if (!user.avatar) user.avatar = avatar;
        await user.save();
      }
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Tài khoản đã bị khoá. Vui lòng liên hệ hỗ trợ.' });
      }
    } else {
      // Create new user — require email
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cấp quyền truy cập email trên Facebook để đăng ký.',
        });
      }
      user = await User.create({
        facebookId,
        email,
        fullName,
        avatar,
      });
    }

    const jwtToken = signToken(user._id);

    res.json({
      success: true,
      message: 'Đăng nhập Facebook thành công!',
      token: jwtToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('Facebook Auth Error:', err);
    res.status(401).json({ success: false, message: 'Xác thực Facebook thất bại' });
  }
});

// ─── GET /api/users/me ────────────────────────────────────────────────────────
router.get('/me', protectUser, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// ─── PUT /api/users/me ────────────────────────────────────────────────────────
router.put('/me', protectUser, async (req, res, next) => {
  try {
    const { fullName, phone, company, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, phone, company, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/users/change-password ──────────────────────────────────────────
router.put('/change-password', protectUser, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải ít nhất 6 ký tự' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/users/history ───────────────────────────────────────────────────
router.get('/history', protectUser, async (req, res) => {
  const user = await User.findById(req.user._id).select('consultations quoteRequests email');
  
  // Auto-sync isDownloaded and clickedAt from Contact records if email matches
  if (user && user.email) {
    const Contact = require('../models/Contact');
    const downloadedContacts = await Contact.find({ email: user.email, isDownloaded: true });
    
    if (downloadedContacts.length > 0) {
      let updated = false;
      for (const c of downloadedContacts) {
        const courseName = c.service ? c.service.replace('Yêu cầu tài liệu: ', '').trim() : '';
        if (courseName) {
          // Find matching un-synced quote request
          const match = user.quoteRequests.find(q => q.product && (q.product.includes(courseName) || courseName.includes(q.product)) && !q.isDownloaded);
          if (match) {
            match.isDownloaded = true;
            match.clickedAt = c.clickedAt || c.updatedAt;
            updated = true;
          }
        }
      }
      if (updated) {
        await user.save();
      }
    }
  }

  res.json({
    success: true,
    consultations: user.consultations.sort((a, b) => b.createdAt - a.createdAt),
    quoteRequests: user.quoteRequests.sort((a, b) => b.createdAt - a.createdAt),
  });
});

// ─── Admin: GET /api/users (list all users) ───────────────────────────────────
const { protect } = require('../middleware/auth');
router.get('/', protect, async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, data: users, total: users.length });
  } catch (err) { next(err); }
});

// ─── Admin: toggle user active ─────────────────────────────────────────────────
router.put('/:id/toggle', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: user });
  } 
  catch (err) 
  { next(err); }
});

module.exports = router;
