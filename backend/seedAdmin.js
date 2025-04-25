const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User'); // ✅ fixed path
const connectDB = require('./src/config/db'); // ✅ fixed path

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    await User.deleteMany({ email: 'admin@fixfriend.com' });

    const admin = new User({
      name: 'Admin',
      email: 'admin@fixfriend.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin seeded with password: admin123');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
