const Feedback = require('../models/FeedBack');
const Service = require('../models/ServiceRequest');

// ✅ Client submits feedback for a completed service
const submitFeedback = async (req, res) => {
  const { serviceId, rating, feedback } = req.body;

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Create new feedback document
    const fb = await Feedback.create({
      service: serviceId,
      client: req.user._id,
      technician: service.technician,
      rating,
      feedback,
    });

    // ✅ Link feedback to service request
    service.feedback = fb._id;
    await service.save();

    res.status(201).json({
      message: 'Feedback submitted and linked successfully.',
      feedback: fb,
    });
  } catch (err) {
    console.error('❌ Error in submitFeedback:', err);
    res.status(500).json({ message: 'Failed to submit feedback.' });
  }
};

// ✅ Technician views all feedback received (optional usage)
const getTechnicianFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ technician: req.user._id })
      .populate('client', 'name email')
      .populate('service', 'title description closedAt');

    res.status(200).json(feedbacks);
  } catch (err) {
    console.error('❌ Error in getTechnicianFeedback:', err);
    res.status(500).json({ message: 'Failed to load feedback.' });
  }
};

module.exports = {
  submitFeedback,
  getTechnicianFeedback,
};
