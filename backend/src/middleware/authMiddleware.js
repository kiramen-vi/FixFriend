const jwt = require('jsonwebtoken');
const User = require('../models/User');


const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    token = parts.length === 2 ? parts[1] : parts[0];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};


const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Not authorized as admin' });
};


const isTechnician = (req, res, next) => {
  if (req.user && req.user.role === 'technician') return next();
  res.status(403).json({ message: 'Technician access only' });
};

module.exports = { protect, isAdmin, isTechnician };
