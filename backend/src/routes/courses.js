const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');
const { optionalUserAuth } = require('../middleware/userAuth');
const { sendDocumentEmail } = require('../utils/mailer');

// Public: GET all courses (driveUrl excluded for security)
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };
    if (category) query.$or = [{ categoryVi: new RegExp(category, 'i') }, { categoryEn: new RegExp(category, 'i') }];
    const courses = await Course.find(query, '-driveUrl').sort({ order: 1 });
    const formatted = courses.map(c => {
      const doc = c.toObject();
      doc.requestCount = doc.priceRequests ? doc.priceRequests.length : 0;
      delete doc.priceRequests;
      return doc;
    });
    res.json({ success: true, data: formatted });
  } catch (err) { next(err); }
});

// Public: GET course by slug (driveUrl excluded for security)
router.get('/:slug', async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, isActive: true }, '-driveUrl');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    const doc = course.toObject();
    doc.requestCount = doc.priceRequests ? doc.priceRequests.length : 0;
    delete doc.priceRequests;
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
});

// Public: Submit price / document request (Sends driveUrl via email to user)
router.post('/:slug/quote', optionalUserAuth, async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    course.priceRequests.push(req.body);
    await course.save();

    // Create a Contact record for Admin Inbox with AES-256 encrypted driveUrl and 32-char token
    const Contact = require('../models/Contact');
    const { encryptText, generateToken } = require('../utils/crypto');
    const downloadToken = generateToken();
    const encryptedDriveUrl = course.driveUrl ? encryptText(course.driveUrl) : '';

    const contact = await Contact.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      message: req.body.message,
      service: 'Yêu cầu tài liệu: ' + course.nameVi,
      lang: req.body.lang || 'vi',
      downloadToken,
      encryptedDriveUrl
    });

    let userQuoteIndex = -1;
    if (req.user) {
      const docName = (req.body.lang === 'en' ? course.nameEn : course.nameVi);
      req.user.quoteRequests.push({
        product: 'Tài liệu: ' + docName,
        email: req.body.email || req.user.email,
        quantity: req.body.quantity || 1,
        message: req.body.message || 'Yêu cầu nhận tài liệu qua Email',
        status: 'pending',
      });
      userQuoteIndex = req.user.quoteRequests.length - 1;
      await req.user.save();
    }

    // Respond to FE immediately for instant response (<50ms)
    res.status(201).json({ success: true, message: 'Request submitted successfully. Document link will be sent to your email.' });

    // Send email asynchronously in background without blocking FE response
    if (course.driveUrl && req.body.email) {
      (async () => {
        try {
          const hostUrl = process.env.BACKEND_URL || 'https://api.thanhbuitdh.com';
          const trackingUrl = `${hostUrl}/api/courses/track-download/${contact.downloadToken || contact._id}`;

          const mailRes = await sendDocumentEmail({
            toEmail: req.body.email,
            userName: req.body.name,
            documentTitle: req.body.lang === 'en' ? (course.nameEn || course.nameVi) : course.nameVi,
            driveUrl: trackingUrl,
            zipPassword: course.zipPassword || '',
            lang: req.body.lang || 'vi',
          });

          if (mailRes && mailRes.success) {
            contact.status = 'replied';
            await contact.save();

            if (req.user && userQuoteIndex >= 0) {
              const User = require('../models/User');
              const freshUser = await User.findById(req.user._id);
              if (freshUser && freshUser.quoteRequests && freshUser.quoteRequests[userQuoteIndex]) {
                freshUser.quoteRequests[userQuoteIndex].status = 'replied';
                await freshUser.save();
              }
            }
          }
        } catch (bgErr) {
          console.error('[Background Email Error]:', bgErr.message);
        }
      })();
    }
  } catch (err) { next(err); }
});

// Public: Tracking redirect URL when user clicks link in email (AES-256 Token One-time use)
router.get('/track-download/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    const Contact = require('../models/Contact');
    const { decryptText } = require('../utils/crypto');
    const mongoose = require('mongoose');

    let contact = await Contact.findOne({ downloadToken: token });
    if (!contact && mongoose.Types.ObjectId.isValid(token)) {
      contact = await Contact.findById(token);
    }

    const clientUrl = process.env.CLIENT_URL;

    if (!contact) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><title>Invalid Link</title></head>
        <body style="background:#0a0a0a; color:#fff; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; text-align:center;">
          <div>
            <h2 style="color:#ef4444;">⚠️ Invalid Link</h2>
            <p style="color:#888;">Document download link does not exist or has been removed.</p>
          </div>
        </body>
        </html>
      `);
    }

    // Decrypt AES-256 encrypted Google Drive URL
    let driveRedirectUrl = 'https://drive.google.com';
    if (contact.encryptedDriveUrl) {
      const decrypted = decryptText(contact.encryptedDriveUrl);
      if (decrypted) driveRedirectUrl = decrypted;
    }

    let targetDocUrl = `${clientUrl}/documents`;
    let zipPassword = '';

    const courseName = contact.service ? contact.service.replace('Yêu cầu tài liệu: ', '').trim() : '';
    if (courseName) {
      const course = await Course.findOne({
        $or: [{ nameVi: courseName }, { nameEn: courseName }]
      });
      if (course) {
        if (course.slug) targetDocUrl = `${clientUrl}/documents/${course.slug}?openQuote=true`;
        if (course.driveUrl && !contact.encryptedDriveUrl) driveRedirectUrl = course.driveUrl;
        if (course.zipPassword) zipPassword = course.zipPassword;
      }
    }
    // Ignore HEAD requests & Email Scanners / Link Prefetchers (GoogleImageProxy, SafeLinks, etc.)
    if (req.method === 'HEAD') return res.status(200).end();

    const ua = (req.headers['user-agent'] || '').toLowerCase();
    const isBotScanner = /googleimageproxy|safelinks|bot|spider|crawler|preview|facebookexternalhit|slackbot|whatsapp|telegram|microsoft|outlook|yandex|baidu/i.test(ua);
    const isPrefetch = req.headers['purpose'] === 'prefetch' || req.headers['x-purpose'] === 'preview' || req.headers['x-moz'] === 'prefetch';

    if (isBotScanner || isPrefetch) {
      console.log(`[Bot Scanner/Prefetch Ignored] UA: ${ua}`);
      return res.redirect(driveRedirectUrl);
    }

    // CHECK ONE-TIME USE: If already clicked before, show Expired Notice Page!
    if (contact.isDownloaded) {
      const isEn = contact.lang === 'en';
      const formattedTime = contact.clickedAt ? new Date(contact.clickedAt).toLocaleString(isEn ? 'en-US' : 'vi-VN') : (isEn ? 'previously' : 'trước đó');
      
      const pageTitle = isEn ? 'Link Has Been Used - THANHBUITDH' : 'Liên kết đã được sử dụng - THANHBUITDH';
      const heading = isEn ? 'LINK HAS BEEN USED ONCE' : 'LIÊN KẾT ĐÃ ĐƯỢC SỬ DỤNG 1 LẦN';
      const bodyText = isEn 
        ? `According to document security policy of <strong>THANHBUITDH</strong>, this link is valid for <strong>1 single download only</strong> and was accessed at:`
        : `Theo chính sách bảo mật tài liệu của <strong>THANHBUITDH</strong>, liên kết này chỉ có hiệu lực cho <strong>1 lượt tải duy nhất</strong> và đã được truy cập vào lúc:`;
      const tipText = isEn
        ? `💡 <em>If you need to download this document again, please visit the website and click <strong>"Get Document"</strong> once more to receive a new link via Email.</em>`
        : `💡 <em>Nếu bạn cần tải lại tài liệu, vui lòng truy cập website và bấm <strong>"Nhận tài liệu"</strong> một lần nữa để nhận liên kết mới qua Email.</em>`;
      const btnText = isEn ? '📥 Get Document' : '📥 Nhận tài liệu';

      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${pageTitle}</title>
        </head>
        <body style="background: #0a0a0a; color: #ffffff; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; box-sizing: border-box;">
          <div style="background: #141414; border: 1px solid #2a2a2a; border-radius: 16px; padding: 2.5rem; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
            <div style="width: 64px; height: 64px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 28px;">
              🔒
            </div>
            <h2 style="color: #ffffff; margin: 0 0 0.75rem 0; font-size: 20px; font-weight: 700;">${heading}</h2>
            <p style="color: #aaaaaa; line-height: 1.6; font-size: 14px; margin-bottom: 1.25rem;">
              ${bodyText}
              <br><strong style="color: #FF6B00; display: inline-block; margin-top: 6px; font-size: 15px;">${formattedTime}</strong>
            </p>
            ${zipPassword ? `
              <div style="background: #1e1b18; border: 1px solid #FF6B00; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1.25rem; font-size: 13px; color: #ffffff; text-align: center;">
                🔑 ${isEn ? 'Extraction Password:' : 'Mật khẩu giải nén file:'} 
                <strong style="color: #FF6B00; font-family: monospace; font-size: 16px; background: #000; padding: 3px 8px; border-radius: 4px; margin-left: 6px;">${zipPassword}</strong>
              </div>
            ` : ''}
            <div style="background: #1e1e1e; border-radius: 8px; padding: 1rem; margin-bottom: 2rem; font-size: 13px; color: #888888; text-align: left; line-height: 1.5; border-left: 3px solid #FF6B00;">
              ${tipText}
            </div>
            <a href="${targetDocUrl}" style="background: linear-gradient(135deg, #FF6B00, #FF8533); color: #ffffff; padding: 12px 28px; text-decoration: none; font-weight: 700; border-radius: 25px; display: inline-block; font-size: 14px; box-shadow: 0 4px 15px rgba(255,107,0,0.3);">
              ${btnText}
            </a>
          </div>
        </body>
        </html>
      `);
    }

    // FIRST CLICK: Mark downloaded and redirect to Google Drive!
    contact.isDownloaded = true;
    contact.clickedAt = new Date();
    await contact.save();

    // Update user's profile history record if matched
    if (contact.email) {
      const User = require('../models/User');
      const user = await User.findOne({ email: contact.email });
      if (user && user.quoteRequests && user.quoteRequests.length > 0) {
        // Find latest unclicked matching item, or fallback to latest matching item
        let item = user.quoteRequests.slice().reverse().find(q => q.product && (q.product.includes(courseName) || courseName.includes(q.product)) && !q.isDownloaded);
        if (!item && courseName) {
          item = user.quoteRequests.slice().reverse().find(q => q.product && (q.product.includes(courseName) || courseName.includes(q.product)));
        }
        if (!item) {
          item = user.quoteRequests[user.quoteRequests.length - 1];
        }
        if (item) {
          item.isDownloaded = true;
          item.clickedAt = contact.clickedAt || new Date();
          await user.save();
        }
      }
    }

    // STREAM FILE DIRECTLY OR MASK IN EMBEDDED PORTAL (Che Link Drive 100% không bao giờ hiện ra URL Bar)
    const { streamDriveFile } = require('../utils/driveStream');
    const isStreamed = await streamDriveFile(driveRedirectUrl, courseName, res);
    
    if (!isStreamed) {
      // Fallback for View-Only / Folder Links: Render Secure Masked Viewer on our domain
      const isEn = contact.lang === 'en';
      const previewEmbedUrl = driveRedirectUrl.includes('/view') ? driveRedirectUrl.replace('/view', '/preview') : driveRedirectUrl;

      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${courseName || 'Tài Liệu Bảo Mật - THANHBUITDH'}</title>
          <style>
            body { margin:0; padding:0; background:#0a0a0a; color:#fff; font-family:system-ui,-apple-system,sans-serif; overflow:hidden; height:100vh; display:flex; flex-direction:column; }
            .header { background:#141414; border-bottom:1px solid #2a2a2a; padding:0.85rem 1.5rem; display:flex; align-items:center; justify-content:space-between; }
            .title { font-size:15px; font-weight:700; color:#FF6B00; display:flex; align-items:center; gap:8px; }
            .iframe-container { flex:1; width:100%; border:none; background:#111; }
            iframe { width:100%; height:100%; border:none; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">🔒 THANHBUITDH - ${courseName || (isEn ? 'Protected Document' : 'Tài Liệu Bảo Mật')}</div>
            ${zipPassword ? `<div style="font-size:13px; color:#aaa;">🔑 ${isEn ? 'Password:' : 'Mật khẩu:'} <strong style="color:#FF6B00; background:#000; padding:3px 8px; border-radius:4px;">${zipPassword}</strong></div>` : ''}
          </div>
          <div class="iframe-container">
            <iframe src="${previewEmbedUrl}" allow="autoplay"></iframe>
          </div>
        </body>
        </html>
      `);
    }
  } catch (err) {
    next(err);
  }
});

// Admin: GET all
router.get('/admin/all', protect, async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ order: 1 });
    res.json({ success: true, data: courses });
  } catch (err) { next(err); }
});

// Admin: CREATE
router.post('/', protect, async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (err) { next(err); }
});

// Admin: UPDATE
router.put('/:id', protect, async (req, res, next) => {
  try {
    const existingCourse = await Course.findById(req.params.id);
    if (!existingCourse) return res.status(404).json({ success: false, message: 'Course not found' });

    if (req.body.order !== undefined && Number(req.body.order) !== existingCourse.order) {
      const newOrder = Number(req.body.order);
      const conflictCourse = await Course.findOne({ order: newOrder, _id: { $ne: existingCourse._id } });
      if (conflictCourse) {
        conflictCourse.order = existingCourse.order;
        await conflictCourse.save();
      }
    }

    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: course });
  } catch (err) { next(err); }
});

// Admin: DELETE
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
