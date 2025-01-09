const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Patient = require("../models/Patient");
const fetchStaff = require("../middleware/fetchStaff");

router.post('/create', fetchStaff, [
   body('name', "Name is Required").isString().notEmpty(),
   body('diseases').isArray().optional(),
   body('allergies').isArray().optional(),
   body('roomNumber', 'Room number is required').isString().notEmpty(),
   body('bedNumber', "Bed Number is required").isString().notEmpty(),
   body('floorNumber', "Floor Number is required").isString().notEmpty(),
   body('age', 'Age must be a positive integer').isInt({ min: 0 }),
   body('gender', "Gender must be Male, Female, or Other").isIn(['Male', 'Female', 'Other']),
   body('contactInfo', 'Contact Info must be a valid 10-digit number').matches(/^[0-9]{10}$/),
   body('emergencyContact', 'Emergency Contact must be a valid 10-digit number').matches(/^[0-9]{10}$/)
],  async (req, res) => {
   if (req.staff.role == "Manager") {
      const errors = validationResult(req);
      if (!(errors.isEmpty())) {
         res.status(400).json({
            errors: errors.array(),
         });
      } else {
         try {
            const patient = new Patient(req.body);
            const savedPatient = await patient.save();
            res.status(201).json(savedPatient);
         } catch (err) {
            res.status(400).json({ error: err.message });
         }
      }
   } else return res.status(403).json({
      error: "Access Denied (Only permitted to Manager)",
      success: false
   })
});

// Get all patients
router.get('/fetch', fetchStaff, async (req, res) => {
   try {
      const patients = await Patient.find();
      res.json(patients);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// Get a specific patient by ID
router.get('/fetch/:id', fetchStaff, async (req, res) => {
   try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
         return res.status(404).json({ error: 'Patient not found' });
      }
      res.json(patient);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// Update a patient by ID
router.put('/update/:id', fetchStaff, [
   body('name', "Name is Required").isString().notEmpty(),
   body('diseases').isArray().optional(),
   body('allergies').isArray().optional(),
   body('roomNumber', 'Room number is required').isString().notEmpty(),
   body('bedNumber', "Bed Number is required").isString().notEmpty(),
   body('floorNumber', "Floor Number is required").isString().notEmpty(),
   body('age', 'Age must be a positive integer').isInt({ min: 0 }),
   body('gender', "Gender must be Male, Female, or Other").isIn(['Male', 'Female', 'Other']),
   body('contactInfo', 'Contact Info must be a valid 10-digit number').matches(/^[0-9]{10}$/),
   body('emergencyContact', 'Emergency Contact must be a valid 10-digit number').matches(/^[0-9]{10}$/)
], async (req, res) => {
   if (req.staff.role == "Manager") {
      const errors = validationResult(req);
      if (!(errors.isEmpty())) {
         res.status(400).json({
            errors: errors.array(),
         });
      } else {
         try {
            const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
               new: true,
               runValidators: true,
            });
            if (!updatedPatient) {
               return res.status(404).json({ error: 'Patient not found' });
            }
            res.json(updatedPatient);
         } catch (err) {
            res.status(500).json({ error: err.message });
         }
      }
   } else return res.status(403).json({
      error: "Access Denied (Only permitted to Manager)",
      success: false
   })
});

// Assign a meal to a patient
router.patch('/assignMeal/:id/', fetchStaff, [
   body('morningMealId', "Morning Meal ID is required").optional(),
   body('eveningMealId', "Evening meal ID is required").optional(),
   body('nightMealId', "Night meal ID is required").optional(),
], async (req, res) => {
   if (req.staff.role == "Manager") {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
   
      const { morningMealId, eveningMealId, nightMealId } = req.body;
   
      try {
         const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            {
               'dietPlans.morningMealId': morningMealId,
               'dietPlans.eveningMealId': eveningMealId,
               'dietPlans.nightMealId': nightMealId,
            },
            { new: true, runValidators: true }
         );
   
         if (!updatedPatient) {
            return res.status(404).json({ error: 'Patient not found' });
         }
   
         res.json(updatedPatient);
      } catch (err) {
         res.status(500).json({ error: err.message });
      }
   } else return res.status(403).json({
      error: "Access Denied (Only permitted to Manager)",
      success: false
   })
});

// Delete a patient by ID
router.delete('/delete/:id', fetchStaff, async (req, res) => {
   if (req.staff.role == "Manager") {
      try {
         const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
         if (!deletedPatient) {
            return res.status(404).json({ error: 'Patient not found' });
         }
         res.json({ message: 'Patient deleted successfully' });
      } catch (err) {
         res.status(500).json({ error: err.message });
      }
   } else return res.status(403).json({
      error: "Access Denied (Only permitted to Manager)",
      success: false
   })
});

module.exports = router