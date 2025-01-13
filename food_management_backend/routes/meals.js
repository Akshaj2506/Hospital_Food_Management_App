const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Meal = require("../models/Meal");
const fetchStaff = require("../middleware/fetchStaff");

router.post('/add', fetchStaff, [
   body('mealName', "Meal name can not be empty").notEmpty(),
   body('patientName', "Patient name can not be empty").notEmpty(),
   body('mealTiming', "Meal Timing can not be empty").notEmpty().isIn(["Morning","Evening","Night"]),
   body('ingredients', 'Ingredients must be an array with at least one item').isArray({ min: 1 }),
   body('instructions', "Instructions has to be in an array").optional().isArray(),
   body('preparationStatus', 'Invalid preparation status').optional().isIn(['Pending', 'Preparing', 'Prepared']),
   body('deliveryStatus', 'Invalid delivery status').optional().isIn(['Pending', 'In Transit', 'Delivered']),
   body('preparationStaff','Invalid preparation staff ID').optional().isMongoId(),
   body('deliveryPersonnel', 'Invalid delivery personnel ID').optional().isMongoId(),
], async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
   try {
      const meal = new Meal(req.body);
      const savedMeal = await meal.save();
      res.status(201).json(savedMeal);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

router.post("/addMany", fetchStaff,[
   body("meals", "Meals have to be stored in an array with atleast one record").isArray({min: 1})
], async(req,res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
   try {
      Meal.insertMany(req.body.meals)
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
})

router.get('/fetch', fetchStaff, async (req, res) => {
   try {
      const meals = await Meal.find().populate('preparationStaff deliveryPersonnel');
      res.status(200).json(meals);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

router.get('/fetch/:id', fetchStaff, async (req, res) => {
   try {
      const meal = await Meal.findById(req.params.id).populate('preparationStaff deliveryPersonnel');
      if (!meal) return res.status(404).json({ error: 'Meal not found' });
      res.status(200).json(meal);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});


router.put('/update/:id', fetchStaff, [
   body('mealName','Meal name cannot be empty').optional().notEmpty(),
   body('patientName', "Patient name can not be empty").notEmpty(),
   body('mealTiming', "Meal Timing can not be empty").notEmpty().isIn(["Morning", "Evening", "Night"]),
   body('ingredients','Ingredients must be an array with at least one item').optional().isArray({ min: 1 }),
   body('instructions', "Instructions has to be in an array").optional().isArray(),
   body('preparationStatus', 'Invalid preparation status').optional().isIn(['Pending', 'In Progress', 'Completed']),
   body('deliveryStatus', 'Invalid delivery status').optional().isIn(['Pending', 'In Transit', 'Delivered']),
   body('preparationStaff', 'Invalid preparation staff ID').optional().isMongoId(),
   body('deliveryPersonnel', 'Invalid delivery personnel ID').optional().isMongoId()
], async (req, res) => {
   if (req.staff.role == "Manager" || req.staff.role == "Preparation") {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      try {
         const updatedMeal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
         }).populate('preparationStaff deliveryPersonnel');
   
         if (!updatedMeal) return res.status(404).json({ error: 'Meal not found' });
   
         res.status(200).json(updatedMeal);
      } catch (err) {
         res.status(500).json({ error: err.message });
      }
   } else return res.status(403).json({
      error: "Access Denied (Only Allowed to Manager and Pantry staff)",
      success: false
   })
});
router.delete('/delete/:id', fetchStaff, async (req, res) => {
   try {
      const deletedMeal = await Meal.findByIdAndDelete(req.params.id);
      if (!deletedMeal) return res.status(404).json({ error: 'Meal not found' });
      res.status(200).json({ message: 'Meal deleted successfully' });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

router.patch('/updateStatus/:id/', fetchStaff, [
   body('preparationStatus', 'Invalid preparation status').isIn(['Pending', 'Preparing', 'Prepared']),
   body('deliveryStatus', 'Invalid delivery status').isIn(['Pending', 'In Transit', 'Delivered']),
], async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
   try {
      if (req.body.preparationStatus != "Prepared" &&
         (req.body.deliveryStatus == "In Transit" || req.body.deliveryStatus == "Delivered")) return res.status(400).json({
            error : "Cannot change Delivery Status before Preparation is Completed"
         })
      const updatedMeal = await Meal.findByIdAndUpdate(
         req.params.id,
         {
            preparationStatus: req.body.preparationStatus,
            deliveryStatus: (
               req.body.preparationStatus == "Prepared" && 
               (req.body.deliveryStatus == "In Transit" || req.body.deliveryStatus == "Delivered")) ? req.body.deliveryStatus : "Pending",
         },
         { new: true, runValidators: true }
      );

      if (!updatedMeal) return res.status(404).json({ error: 'Meal not found' });

      res.status(200).json(updatedMeal);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});


module.exports = router