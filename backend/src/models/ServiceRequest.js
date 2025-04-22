const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Unable to Resolve'],
    default: 'Pending',
  },
  closureImage: String,
  createdAt: { type: Date, default: Date.now },
  closedAt: Date,

  // ✅ link feedback to this service
  feedback: { type: mongoose.Schema.Types.ObjectId, ref: 'FeedBack' },
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
