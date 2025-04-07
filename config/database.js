const mongoose = require("mongoose");
const initData = require("../db_init/house_tmp");

const connectDB = async () => {
  console.log(process.env.MONGODB_URI);
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // initData();
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = connectDB;
