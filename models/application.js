const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  user: {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  position: {
    positionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Position",
    },
  },
});
module.exports = mongoose.model("Application", applicationSchema);
