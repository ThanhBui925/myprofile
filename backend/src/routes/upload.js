const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// Multer error handler wrapper
const handleMulterError = (uploadFn) => (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Known multer errors
      let message = 'Lỗi tải file';
      if (err.code === 'LIMIT_FILE_SIZE') message = 'File quá lớn. Tối đa 50MB.';
      if (err.code === 'LIMIT_FILE_COUNT') message = 'Quá nhiều file. Tối đa 10 file.';
      if (err.code === 'LIMIT_UNEXPECTED_FILE') message = err.field || 'File type không hỗ trợ';
      return res.status(400).json({ success: false, message });
    }
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ success: false, message: err.message || 'Lỗi upload file' });
    }
    next();
  });
};

// Upload single file
router.post('/', protect, handleMulterError(upload.single('file')), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Không có file nào được tải lên' });
  }
  const type = req.file.mimetype.startsWith('video') ? 'videos' 
             : req.file.mimetype === 'application/pdf' ? 'catalogs' 
             : 'images';
  res.json({ 
    success: true, 
    url: `/uploads/${type}/${req.file.filename}`,
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size
  });
});

// Upload multiple files
router.post('/multiple', protect, handleMulterError(upload.array('files', 10)), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Không có file nào được tải lên' });
  }
  const files = req.files.map(file => {
    const type = file.mimetype.startsWith('video') ? 'videos' 
               : file.mimetype === 'application/pdf' ? 'catalogs' 
               : 'images';
    return { url: `/uploads/${type}/${file.filename}`, filename: file.filename, originalname: file.originalname };
  });
  res.json({ success: true, files });
});

module.exports = router;
