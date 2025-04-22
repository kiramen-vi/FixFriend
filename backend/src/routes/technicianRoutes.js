const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, isTechnician } = require('../middleware/authMiddleware');

const {
  getAssignedServices,
  getCompletedServices,
  updateServiceStatusWithImage,
} = require('../controllers/technicianController');

// Routes for technician
router.get('/assigned', protect, isTechnician, getAssignedServices);
router.get('/completed', protect, isTechnician, getCompletedServices);
router.put(
  '/update-status/:id',
  protect,
  isTechnician,
  upload.single('closureImage'),
  updateServiceStatusWithImage
);

module.exports = router;
