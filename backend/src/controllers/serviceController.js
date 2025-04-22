const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');

const createServiceRequest = async (req, res) => {
    try {
      const { title, description, serviceType } = req.body;
  
      if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required." });
      }
  
      const service = await ServiceRequest.create({
        client: req.user.id, 
        title,
        description,
        serviceType,
        status: 'Pending',
      });
  
      res.status(201).json({
        message: "Service request submitted successfully.",
        service,
      });
    } catch (error) {
      console.error(" Error creating service request:", error);
      res.status(500).json({ message: "Failed to submit service request." });
    }
  };
  


const getClientServices = async (req, res) => {
  try {
    const services = await ServiceRequest.find({ client: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(services);
  } catch (error) {
    console.error(" Error fetching client services:", error);
    res.status(500).json({ message: "Failed to load services." });
  }
};


const getTechnicianServices = async (req, res) => {
  try {
    const services = await ServiceRequest.find({
      technician: req.user._id,
      status: { $in: ['Assigned', 'In Progress'] },
    }).populate('client', 'name email');

    res.status(200).json(services);
  } catch (error) {
    console.error(" Error fetching technician services:", error);
    res.status(500).json({ message: "Failed to load assigned services." });
  }
};


const closeService = async (req, res) => {
  try {
    const { feedback, rating } = req.body;
    const { serviceId } = req.params;

    const service = await ServiceRequest.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.technician.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    service.status = 'Completed';
    service.closedAt = new Date();
    if (req.file) {
      service.closureImage = `/uploads/${req.file.filename}`;
    }

    await service.save();

    res.status(200).json({ message: "Service marked as completed", service });
  } catch (error) {
    console.error(" Error closing service:", error);
    res.status(500).json({ message: "Failed to close service." });
  }
};


const assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;
    const service = await ServiceRequest.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const technician = await User.findById(technicianId);
    if (!technician || technician.role !== 'technician') {
      return res.status(400).json({ message: "Invalid technician" });
    }

    service.technician = technicianId;
    service.status = 'Assigned';
    await service.save();

    res.status(200).json({ message: "Technician assigned", service });
  } catch (error) {
    console.error(" Error assigning technician:", error);
    res.status(500).json({ message: "Failed to assign technician" });
  }
};

module.exports = {
  createServiceRequest,
  getClientServices,
  getTechnicianServices,
  closeService,
  assignTechnician,
};
