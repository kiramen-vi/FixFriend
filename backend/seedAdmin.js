const mongoose = require('mongoose');
const User = require('./src/models/User'); // adjust path if needed
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing admin
    await User.deleteMany({ role: 'admin' });

    // Let Mongoose hash the password using pre-save hook
    await User.create({
      name: 'Admin User',
      email: 'admin@fixfriend.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('✅ Admin user created with password: admin123');

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
