const mongoose = require("mongoose")

const MealSchema = new mongoose.Schema({
   mealName: { 
      type: String,
      required: true,
      trim: true,
      unique: true
   },
   patientName : {
      type: String,
      required: true,
      trim: true,
   },
   mealTiming : {
      type: String,
      enum: ['Morning', 'Evening', 'Night'],
      default: 'Morning',
   },
   ingredients: { 
      type: [String],
      required: true,
      default: []
   },
   instructions: {
      type: [String], 
      required: true,
      default: [] 
   },
   preparationStatus: {
      type: String,
      enum: ['Pending', 'Preparing', 'Prepared'],
      default: 'Pending',
   },
   preparationStaff: {
      type: mongoose.Schema.ObjectId,
      ref : "staff",
      trim: true 
   },
   deliveryStatus: {
      type: String,
      enum: ['Pending', 'In Transit', 'Delivered'],
      default: 'Pending',
   },
   deliveryPersonnel: {
      type: mongoose.Schema.ObjectId,
      ref : "staff",
      trim: true
   },
});

const Meal = mongoose.model("meal", MealSchema);
module.exports = Meal