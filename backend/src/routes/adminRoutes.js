const express = require('express');
const router = express.Router();

const {
  getDashboardData,
  createTechnician,
  createClient,
  deleteTechnician,
  deleteClient,
  createServiceRequest,
  deleteServiceRequest,
  assignTechnician,
} = require('../controllers/adminController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// ✅ Debug log to confirm routes are loaded
console.log("✅ adminRoutes loaded");

// Dashboard data
router.get('/dashboard', protect, isAdmin, getDashboardData);

// User management
router.post('/create-technician', protect, isAdmin, createTechnician);
router.post('/create-client', protect, isAdmin, createClient);
router.delete('/delete-technician/:id', protect, isAdmin, deleteTechnician);
router.delete('/delete-client/:id', protect, isAdmin, deleteClient);

// Service request management
router.post('/create-service-request', protect, isAdmin, createServiceRequest);
router.delete('/delete-service-request/:id', protect, isAdmin, deleteServiceRequest);

router.put("/assign-technician/:id", protect, isAdmin, assignTechnician);

module.exports = router;
