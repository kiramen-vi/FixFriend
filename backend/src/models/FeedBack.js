const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeedBack', feedbackSchema);