const mongoose = require("mongoose");
const { DB_URL } = require("./config");

module.exports = async () => {
  try {
    await mongoose.connect(DB_URL, {});
    console.log("CONNECTED TO DATABASE SUCCESSFULLY");
  } catch (error) {
    console.error("COULD NOT CONNECT TO DATABASE:", error.message);
  }
};
