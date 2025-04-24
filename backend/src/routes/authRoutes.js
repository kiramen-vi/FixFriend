const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');

// ✅ Temporary test route to verify API is reachable
router.get('/ping', (req, res) => {
  console.log("✅ /api/auth/ping was hit");
  res.send('pong');
});

router.post('/register', (req, res) => {
  console.log("✅ /api/auth/register was hit");
  registerUser(req, res);
});

router.post('/login', (req, res) => {
  console.log("✅ /api/auth/login was hit");
  loginUser(req, res);
});

module.exports = router;
