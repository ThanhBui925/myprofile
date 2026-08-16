require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./src/models/Admin');

async function updatePassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const hashedPassword = await bcrypt.hash('Thanh2001@', 12);
    // Note: Admin pre-save hook hashes the password if we use save(), but updateOne bypasses hooks.
    // If we use updateOne, we hash it manually with 12 rounds (as per hook).
    await Admin.updateOne({ username: 'admin' }, { $set: { password: hashedPassword } });
    console.log('Password updated successfully');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

updatePassword();
