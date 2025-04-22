const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getClientRequests,
  loginUser,
} = require('../controllers/userController');

const { protect, isAdmin } = require('../middleware/authMiddleware');


router.post('/login', loginUser);


router.get('/', protect, isAdmin, getAllUsers);


router.get('/my-requests', protect, getClientRequests);

module.exports = router;
