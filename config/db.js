const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useFindAndModify: false,
      useNewUrlParser: true
    });
    console.log("Mongo Connected");
  } catch (error) {
    console.log("Server Error");
  }
};

module.exports = connectDB;
