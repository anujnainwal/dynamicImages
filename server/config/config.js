require("dotenv").config();
const config = {
  MONGO_URL:
    process.env.MONGO_URL || "mongodb://127.0.0.1:27017/image__modications",
  PORT: process.env.PORT || 3030,
};
module.exports = config;
