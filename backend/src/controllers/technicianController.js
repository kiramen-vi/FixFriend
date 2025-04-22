const Service = require('../models/ServiceRequest');

// ✅ Get all assigned or in-progress services for the technician
const getAssignedServices = async (req, res) => {
  try {
    const technicianId = req.user.id;

    const services = await Service.find({
      technician: technicianId,
      status: { $in: ['Assigned', 'In Progress'] },
    })
      .populate('client', 'name email')
      .populate('technician', 'name email'); // Optional for frontend

    res.status(200).json(services);
  } catch (error) {
    console.error('❌ Error fetching assigned services for technician:', req.user.id, error);
    res.status(500).json({ message: 'Failed to fetch assigned services' });
  }
};

// ✅ Get completed services with feedback for the technician
const getCompletedServices = async (req, res) => {
  try {
    const technicianId = req.user.id;

    const services = await Service.find({
      technician: technicianId,
      status: 'Completed',
    })
      .populate('client', 'name email')
      .populate('feedback') // ✅ Always include feedback
      .populate('technician', 'name email');

    res.status(200).json(services);
  } catch (error) {
    console.error('❌ Error fetching completed services for technician:', req.user.id, error);
    res.status(500).json({ message: 'Failed to fetch completed services' });
  }
};

// ✅ Technician updates service status (accept, skip, complete) + optional image upload
const updateServiceStatusWithImage = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Completed', 'Unable to Resolve', 'In Progress'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const technicianId = req.user.id;

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // ✅ Check technician ownership
    if (service.technician.toString() !== technicianId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    service.status = status;

    if (status === 'Completed') {
      service.closedAt = new Date();
    }

    if (req.file) {
      service.closureImage = `/uploads/${req.file.filename}`;
    }

    await service.save();

    res.status(200).json({
      message: `Service status updated to ${status}`,
      service,
    });
  } catch (error) {
    console.error('❌ Error updating service status:', req.params.id, error);
    res.status(500).json({ message: 'Failed to update service status' });
  }
};

module.exports = {
  getAssignedServices,
  getCompletedServices,
  updateServiceStatusWithImage,
};
