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


router.post('/request-service', protect, createServiceRequest);


router.get('/myservices', protect, getClientServices);


router.get('/assigned', protect, getTechnicianServices);


router.post('/close/:serviceId', protect, upload.single('closureImage'), closeService);


router.put('/:id/assign', protect, assignTechnician);

module.exports = router;
