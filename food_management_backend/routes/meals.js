const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Meal = require("../models/Meal")

router.post('/add', [
   body('mealName', "Meal name can not be empty").notEmpty(),
   body('ingredients', 'Ingredients must be an array with at least one item').optional().isArray({ min: 1 }),
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

router.get('/fetch', async (req, res) => {
   try {
      const meals = await Meal.find().populate('preparationStaff deliveryPersonnel');
      res.status(200).json(meals);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

router.get('/fetch/:id', async (req, res) => {
   try {
      const meal = await Meal.findById(req.params.id).populate('preparationStaff deliveryPersonnel');
      if (!meal) return res.status(404).json({ error: 'Meal not found' });
      res.status(200).json(meal);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});


router.put('/update/:id', [
   body('mealName','Meal name cannot be empty').optional().notEmpty(),
   body('ingredients','Ingredients must be an array with at least one item').optional().isArray({ min: 1 }),
   body('preparationStatus', 'Invalid preparation status').optional().isIn(['Pending', 'In Progress', 'Completed']),
   body('deliveryStatus', 'Invalid delivery status').optional().isIn(['Pending', 'In Transit', 'Delivered']),
   body('preparationStaff', 'Invalid preparation staff ID').optional().isMongoId(),
   body('deliveryPersonnel', 'Invalid delivery personnel ID').optional().isMongoId()
], async (req, res) => {
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
});
router.delete('/delete/:id', async (req, res) => {
   try {
      const deletedMeal = await Meal.findByIdAndDelete(req.params.id);
      if (!deletedMeal) return res.status(404).json({ error: 'Meal not found' });
      res.status(200).json({ message: 'Meal deleted successfully' });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

router.patch('/updateStatus/:id/', [
   body('preparationStatus', 'Invalid preparation status').optional().isIn(['Pending', 'In Progress', 'Completed']),
   body('deliveryStatus', 'Invalid delivery status').optional().isIn(['Pending', 'In Transit', 'Delivered']),
], async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

   try {
      const updatedMeal = await Meal.findByIdAndUpdate(
         req.params.id,
         {
            preparationStatus: req.body.preparationStatus,
            deliveryStatus: req.body.deliveryStatus,
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