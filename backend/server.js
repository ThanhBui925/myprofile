require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [process.env.CLIENT_URL];
    if (!origin || allowed.includes(origin)) return callback(null, true);
    callback(null, true); // Allow all during dev to avoid issues
  },
  credentials: true,
}));
app.use((req, res, next) => {
  console.log(`[BACKEND REQUEST] ${req.method} ${req.url} - Auth: ${req.headers.authorization || 'none'}`);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directories exist
const fs = require('fs');
['uploads/images', 'uploads/videos', 'uploads/catalogs'].forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/banners', require('./src/routes/banners'));
app.use('/api/services', require('./src/routes/services'));
app.use('/api/projects', require('./src/routes/projects'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/courses', require('./src/routes/courses'));
app.use('/api/company', require('./src/routes/company'));
app.use('/api/partners', require('./src/routes/partners'));
app.use('/api/contact', require('./src/routes/contact'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/upload', require('./src/routes/upload'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', company: process.env.APP_NAME || 'THANHTDH', timestamp: new Date() });
});

// Error handler
app.use(require('./src/middleware/errorHandler'));

// Connect DB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 ${process.env.APP_NAME || 'THANHTDH'} API running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
