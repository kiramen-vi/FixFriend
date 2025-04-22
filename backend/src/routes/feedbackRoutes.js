const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  submitFeedback,
  getTechnicianFeedback,
} = require('../controllers/feedbackController');

router.post('/', protect, submitFeedback);
router.get('/technician', protect, getTechnicianFeedback);

module.exports = router;
