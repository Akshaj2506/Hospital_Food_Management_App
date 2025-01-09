const express = require("express");
const router = express.Router();
const {body, validationResult} = require("express-validator")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const path = require("path")
const fetchUser = require("../middleware/fetchUser")
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/create',
   [
      body('email', "Wrong format of email entered").isEmail(),
      body('password', "Password is not as per specifications").equals("Password@2025"),
      body('role', "Role should not be empty").isLength({min : 1}),
   ]
   , async (req, res) => {
      // Checking for any sort of errors in the request, return errors
      const errors = validationResult(req);
      if (!(errors.isEmpty())) {
         res.status(400).json({
            errors: errors.array(),
         });
      } else {
         // Checking if the user already exists
         const user = await User.findOne({ email: req.body.email });
         if (user) {
            return res.status(400).json({
               error: "User already exists",
               success: false
            });
         }
         // Create user if no issues found
         const { email, password, role } = req.body;
         try {
            const salt = await bcryptjs.genSalt(10);
            const secPass = await bcryptjs.hash(password, salt);
            const createdUser = await User.create({
               email: email,
               password: secPass,
               role: role,
            })
            const data = {
               user: {
                  id: createdUser.id
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
         const user = await User.findOne({ email });
         // Checking if the user already exists
         if (!user) {
            return res.status(400).json({
               error: "User does not exist",
               success: false
            });
         }
         const deHashedPassword = await bcryptjs.compare(password, user.password);
         // checking if the password is correct
         if (!deHashedPassword) {
            return res.status(400).json({
               error: "Kindly enter correct credentials",
               success: false
            });
         }
         // signing data with JWT
         const data = {
            user: {
               id: user.id
            }
         }
         const authToken = jwt.sign(data, JWT_SECRET);
         success = true;
         res.json({ authToken, success });
      } catch (error) {
         console.error(error.message);
         res.status(403).json({
            error: "Internal Server Error",
            success: true
         });
      }
   }
)

router.post('/getuser', fetchUser, async (req, res) => {
   const userID = req.user.id;
   const user = await User.findById(userID).select("-password");
   res.json(user);
})

module.exports = router