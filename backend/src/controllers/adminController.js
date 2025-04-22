const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const Feedback = require('../models/FeedBack');

// Admin Dashboard: Clients, Technicians, Feedbacks, Segmented Services
const getDashboardData = async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' });
    const technicians = await User.find({ role: 'technician' });

    const openServiceRequests = await ServiceRequest.find({
      status: { $nin: ['Completed', 'Unable to Resolve'] }
    })
      .populate('client', 'name email')
      .populate('technician', 'name email');

    const completedServiceRequests = await ServiceRequest.find({
      status: 'Completed'
    })
      .populate('client', 'name email')
      .populate('technician', 'name email');

    const feedbacks = await Feedback.find()
      .populate('client', 'name email')
      .populate('technician', 'name email')
      .populate('service', 'serviceType status');

    res.json({
      clients,
      technicians,
      openServiceRequests,
      completedServiceRequests,
      feedbacks,
    });
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a technician
const createTechnician = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newTechnician = await User.create({ name, email, password, role: 'technician' });
    res.status(201).json({ message: 'Technician created', technician: newTechnician });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a client
const createClient = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newClient = await User.create({ name, email, password, role: 'client' });
    res.status(201).json({ message: 'Client created', client: newClient });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete technician or client
const deleteTechnician = async (req, res) => {
  try {
    const technician = await User.findOneAndDelete({ _id: req.params.id, role: 'technician' });
    if (!technician) return res.status(404).json({ message: 'Technician not found' });
    res.json({ message: 'Technician deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteClient = async (req, res) => {
  try {
    const client = await User.findOneAndDelete({ _id: req.params.id, role: 'client' });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a service request
const createServiceRequest = async (req, res) => {
  try {
    const { title, description } = req.body;
    const clientId = req.user._id;

    const newService = new ServiceRequest({
      client: clientId,
      description,
      serviceType: title,
      status: 'Pending',
    });

    await newService.save();
    res.status(201).json({ message: 'Service request submitted', service: newService });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create service request' });
  }
};

// Delete service request
const deleteServiceRequest = async (req, res) => {
  try {
    const deleted = await ServiceRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Service request not found' });
    res.json({ message: 'Service request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete service request' });
  }
};

// Assign technician
const assignTechnician = async (req, res) => {
    try {
      const serviceId = req.params.id;
      const { technicianId } = req.body;
  
      const technician = await User.findById(technicianId);
      if (!technician || technician.role !== "technician") {
        return res.status(400).json({ message: "Invalid technician" });
      }
  
      const service = await ServiceRequest.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service request not found" });
      }
  
      service.technician = technicianId;
      service.status = "Assigned";
      await service.save();
  
      res.status(200).json({ message: "Technician assigned successfully" });
    } catch (error) {
      console.error("Assign Technician Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

module.exports = {
  getDashboardData,
  createTechnician,
  createClient,
  deleteTechnician,
  deleteClient,
  createServiceRequest,
  deleteServiceRequest,
  assignTechnician,
};
