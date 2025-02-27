const mongoose = require("mongoose");
const { boolean, number } = require("zod");

const trainerSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  imageUrl: {
    type: String,
    required: true,
  },
  avgRating: { type: Number, default: 0 },
  qualifications: { type: String, required: true },
  linkedin: { type: String, required: true },
  experience: { type: String, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'listing' }],
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  },
  availability: { type: [String], default: [], required: false },
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'trainer'],
    default: 'trainer'
  },
  isApproved: { type: Boolean, default: false },
  about: { type: String, required: true },
  workHistory: { type: String, required: true },
  educationDetail: { type: String, required: true },
},
  {
    timestamps: true
  });

module.exports = mongoose.model('Trainer', trainerSchema);
