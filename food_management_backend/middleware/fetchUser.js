const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = (req, res, next) => {
   try {
      const token = req.header("auth-token");
      if (!token) {
         res.status(500).json({ error: "Kindly use an authentic auth token" })
      }
      const data = jwt.verify(token, JWT_SECRET);
      req.user = data.user;
      next();
   } catch (error) {
      console.error(error.message);
      res.status(401).json({ error: "Internal Server Error" });
   }
}

module.exports = fetchUser;