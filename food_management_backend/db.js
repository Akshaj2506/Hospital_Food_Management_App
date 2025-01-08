const mongoose = require('mongoose')
const path = require("path")

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const dbURI = process.env.CONNECT_STRING

const connectDB = () => {
   mongoose.connect(dbURI).then(console.log(`Connected to Database!`));
}

module.exports = connectDB