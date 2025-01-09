const express = require("express")
const app = express()
const cors = require("cors");
const connectDB = require("./db");
const path = require("path")
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const PORT = process.env.BACK_PORT

connectDB()
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
   extended: true
}))

app.use("/api/auth", require("./routes/auth"));
app.use("/api/patients", require("./routes/patients"));
app.use("/api/meals", require("./routes/meals"));

app.get('/', (req, res) => {
   res.send("Hospital Food Management Backend: RUNNING")
})

app.listen(PORT, () => {
   console.log(`Backend running on http://localhost:${PORT}`);
})