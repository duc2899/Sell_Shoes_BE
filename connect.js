const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI; // URI kết nối từ file .env

const connectDB = async () => {
  mongoose
    .connect(
      uri
    )
    .then((con) => {  
      console.log("DB Connection successful");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;
