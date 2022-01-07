const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
  },
  salt: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  cv: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
