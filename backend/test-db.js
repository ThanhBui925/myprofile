const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    const users = await User.find();
    console.log(`Found ${users.length} users:`);
    users.forEach(u => {
      console.log(`- ID: ${u._id}`);
      console.log(`  Name: ${u.fullName}`);
      console.log(`  Email: ${u.email}`);
      console.log(`  IsActive: ${u.isActive}`);
    });

    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
