const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: { type: String, require: true },
  username: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema); //"User" is the one connecting to the database table named "User"
