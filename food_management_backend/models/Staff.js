const mongoose = require("mongoose")

const StaffSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true
   },
   email: { 
      type: String, 
      required: true 
   },
   password: {
      type: String,
      required: true
   },
   role: { 
      type: String, 
      enum: ["Manager", 'Pantry', 'Delivery'], 
      required: true 
   },
   location: { 
      type: String, 
      required: true, 
      trim: true 
   },
}, { timestamps: true });

module.exports = mongoose.model('staff', StaffSchema);