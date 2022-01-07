const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const positionSchema = new Schema({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  technologies: [
    {
      type: String,
      required: true,
    },
  ],
  role: {
    type: String,
    enum: ["USER", "PM"],
    default: "USER",
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
});

module.exports = mongoose.model("Position", positionSchema);
