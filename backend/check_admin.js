const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admins = await Admin.find();
    console.log(`Found ${admins.length} admins.`);
    admins.forEach(a => {
      console.log(`- Username: ${a.username}, Email: ${a.email}, Role: ${a.role}`);
    });
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
