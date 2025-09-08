const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
  },
  education: {
    type: String,
  },
  skills: {
    type: [String],
  },
  linkedin: {
    type: String,
  },
  role: {
    type: String,
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher', 'Experienced'],
    default: 'Fresher',
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
  },
  resume: {
    type: String, // Store path to the file
  },
  profileImage: {
    type: String, // Store path to the file
  },
  github: {
    type: String,
  },
  portfolio: {
    type: String,
  },
  website: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Profile', ProfileSchema);
