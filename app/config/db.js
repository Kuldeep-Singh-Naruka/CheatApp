require('dotenv').config();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT);
    console.log("Connected to the database!");
  } catch (error) {
    console.error("Cannot connect to the database!", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
