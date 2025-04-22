const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getClientRequests,
  loginUser,
} = require('../controllers/userController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// Login route
router.post('/login', loginUser);

// Admin: Get all users
router.get('/', protect, isAdmin, getAllUsers);

// Client: Get their own service requests
router.get('/my-requests', protect, getClientRequests);

module.exports = router;
