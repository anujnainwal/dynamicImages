const mongoose = require("mongoose");
const config = require("./config");

mongoose.set("strictQuery", false);

const connectDB = () => {
  mongoose
    .connect(config.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((response) => {
      console.log("MongoDB Connection Succeeded.");
    })
    .catch((error) => {
      console.log("Error in DB connection: " + error);
    });
};
module.exports = connectDB;
