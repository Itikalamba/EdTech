const mongoose = require("mongoose");
require("dotenv").config();
exports.connect = () => {
  try {
    mongoose
      .connect(process.env.MONGODB_URL, {
        UseNewUrlParser: true,
        UseUnifiedTopology: true,
      })
      .then(() => {
        console.log("DB connected Successfully ...");
      });
  } catch (error) {
    console.log("Error while connecting db : ", error);
    process.exit(1);
  }
};
