const mongoose = require('mongoose');

const admissionEnquirySchema = new mongoose.Schema({
  parentName: {
    type: String,
    required: [true, 'Parent name is required'],
    trim: true,
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
  },
  className: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  message: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'resolved', 'replied'],
    default: 'new',
  },
}, { timestamps: true });

module.exports = mongoose.model('AdmissionEnquiry', admissionEnquirySchema);
