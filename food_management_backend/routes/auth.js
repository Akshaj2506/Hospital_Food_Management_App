const express = require("express");
const router = express.Router();
const {body, validationResult} = require("express-validator")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Staff = require("../models/Staff")
const path = require("path")
const fetchStaff = require("../middleware/fetchStaff")
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/create',
   [
      body('name', "Name can not be empty").notEmpty(),
      body('email', "Wrong format of email entered").isEmail(),
      body('password', "Password is not as per specifications").equals("Password@2025"),
      body('role', "Role should not be empty").isIn(["Manager", "Pantry", "Delivery"]),
      body('location', "Location can not be empty").notEmpty()
   ]
   , async (req, res) => {
      // Checking for any sort of errors in the request, return errors
      const errors = validationResult(req);
      if (!(errors.isEmpty())) {
         res.status(400).json({
            errors: errors.array(),
         });
      } else {
         // Checking if the staff already exists
         const staff = await Staff.findOne({ email: req.body.email });
         if (staff) {
            return res.status(400).json({
               error: "Staff already exists",
               success: false
            });
         }
         // Create staff if no issues found
         const { name, email, password, role, location } = req.body;
         try {
            const salt = await bcryptjs.genSalt(10);
            const secPass = await bcryptjs.hash(password, salt);
            const createdStaff = await Staff.create({
               name,
               email,
               password: secPass,
               role,
               location
            })
            const data = {
               staff: {
                  id: createdStaff.id,
                  role : createdStaff.role
               }
            }
            // signing data with JWT
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ authToken, success : true});
         } catch (err) {
            res.status(500).json({
               error: err.message,
               success: false
            });
         }
      }
   }
);

router.post("/login",
   [
      body('email', "Enter a valid Email ID").isEmail(),
      body('password', "Password is not as per specifications").equals("Password@2025")
   ], async (req, res) => {
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
         return res.status(400).json({
            errors: errors.array(),
            success: false
         });
      }
      try {
         const { email, password } = req.body;
         const staff = await Staff.findOne({ email });
         // Checking if the staff already exists
         if (!staff) {
            return res.status(400).json({
               error: "Staff does not exist",
               success: false
            });
         }
         const deHashedPassword = await bcryptjs.compare(password, staff.password);
         // checking if the password is correct
         if (!deHashedPassword) {
            return res.status(400).json({
               error: "Kindly enter correct credentials",
               success: false
            });
         }
         // signing data with JWT
         const data = {
            staff: {
               id: staff.id,
               role: staff.role
            }
         }
         const authToken = jwt.sign(data, JWT_SECRET);
         res.json({ authToken, success : true });
      } catch (error) {
         console.error(error.message);
         res.status(403).json({
            error: "Internal Server Error",
            success: true
         });
      }
   }
)

router.post('/getstaff', fetchStaff, async (req, res) => {
   const staffID = req.staff.id;
   const staff = await Staff.findById(staffID).select("-password");
   res.json(staff);
})

router.get("/getAllStaff", fetchStaff, async (req, res) => {
   const staff = await Staff.find().select("-password");
   res.json(staff);
})

module.exports = router