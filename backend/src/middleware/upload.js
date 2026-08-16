const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Ensure upload directories exist
const UPLOAD_BASE = path.join(__dirname, '../../uploads');
const UPLOAD_DIRS = ['images', 'videos', 'catalogs'];
UPLOAD_DIRS.forEach(dir => {
  const fullPath = path.join(UPLOAD_BASE, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const type = file.mimetype.startsWith('video') ? 'videos' 
               : file.mimetype === 'application/pdf' ? 'catalogs' 
               : 'images';
    const destPath = path.join(UPLOAD_BASE, type);
    // Ensure dir exists at runtime too
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    cb(null, destPath);
  },
  filename: function(req, file, cb) {
    // Use crypto.randomUUID (built-in Node 19+) or fallback
    const uniqueId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueId}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
    'video/mp4', 'video/webm',
    'application/pdf',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', `File type "${file.mimetype}" not supported. Allowed: jpg, png, webp, gif, svg, mp4, webm, pdf`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

module.exports = upload;
