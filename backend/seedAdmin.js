const mongoose = require('mongoose');
const User = require('./src/models/User'); 
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Connected to MongoDB');

   
    await User.deleteMany({ role: 'admin' });


    const newAdmin = new User({
        name: 'Admin User',
        email: 'admin@fixfriend.com',
        password: 'admin123',
        role: 'admin',
      });
      await newAdmin.save();

    console.log(' Admin user created with password: admin123');

    mongoose.disconnect();
  } catch (error) {
    console.error(' Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
