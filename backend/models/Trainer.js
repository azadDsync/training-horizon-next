const mongoose = require("mongoose");
const { boolean } = require("zod");

const trainerSchema = new mongoose.Schema({
  _id:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
  fname: { type: String, required: true },
  lname: { type: String, required: true },
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
  phone: { type: String, required: true }, 
  address: { type: String, required: true },
  password: { type: String, required: true },
  role:{
    type: String,
    enum: ['user', 'admin', 'trainer'],
    default: 'trainer' 
},
  isApproved: { type: Boolean, default: false } 
}, {
  timestamps: true 
});

module.exports = mongoose.model('Trainer', trainerSchema);
