const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const token = generateToken(user._id, user.role);
  
      res.status(200).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  ;


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClientRequests = async (req, res) => {
    try {
      const clientId = req.user._id || req.user.id;
  
      if (!clientId) {
        return res.status(400).json({ message: "Client ID missing from request." });
      }
  
      const openRequests = await ServiceRequest.find({
        client: clientId,
        status: { $ne: 'Completed' },
      }).populate('technician', 'name email');
  
      const completedRequests = await ServiceRequest.find({
        client: clientId,
        status: 'Completed',
      })
        .populate('technician', 'name email')
        .populate('feedback');
  
      res.status(200).json({
        openRequests,
        completedRequests,
      });
    } catch (error) {
      console.error(" Error in getClientRequests:", error);
      res.status(500).json({ message: 'Failed to fetch service requests.' });
    }
  };
  
  

module.exports = {
  loginUser,
  getAllUsers,
  getClientRequests,
};
