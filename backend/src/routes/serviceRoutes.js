const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

const {
  createServiceRequest,
  getClientServices,
  getTechnicianServices,
  closeService,
  assignTechnician,
} = require('../controllers/serviceController');

// ✅ Client submits a new service request
router.post('/request-service', protect, createServiceRequest);

// ✅ Client views their submitted services
router.get('/myservices', protect, getClientServices);

// ✅ Technician views assigned services
router.get('/assigned', protect, getTechnicianServices);

// ✅ Technician closes a service (upload image + feedback + rating)
router.post('/close/:serviceId', protect, upload.single('closureImage'), closeService);

// ✅ Admin assigns a technician to a service
router.put('/:id/assign', protect, assignTechnician);

module.exports = router;
