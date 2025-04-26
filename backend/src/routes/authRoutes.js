const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');


router.get('/ping', (req, res) => {
  console.log(" /api/auth/ping was hit");
  res.send('pong');
});


router.post('/register', registerUser);
router.post('/login', loginUser);


router.get('/profile', protect, getProfile);

module.exports = router;
