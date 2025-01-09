const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true
   },
   diseases: {
      type: [String],
      default: []
   },
   allergies: {
      type: [String],
      default: []
   },
   roomNumber: {
      type: String,
      required: true,
      trim: true
   },
   bedNumber: {
      type: String,
      required: true,
      trim: true
   },
   floorNumber: {
      type: String,
      required: true,
      trim: true
   },
   age: {
      type: Number,
      required: true,
      min: 0
   },
   gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
      trim: true
   },
   contactInfo: {
      type: String,
      required: true
   },
   emergencyContact: {
      type: String,
      required: true
   }
});

// Export the Patient model
const Patient = mongoose.model('patients', PatientSchema);

module.exports = Patient;
