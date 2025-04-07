const mongoose = require("mongoose");
const moment = require("moment");

const Message = mongoose.model("messages", {
  content: String,
  file: {
    type: {
      type: String,
      enum: ["image", "video", "audio", "other"],
    },
    url: String,
    name: String,
    size: Number,
    width: Number,
    height: Number,
    duration: Number,
    preview: String,
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
});
module.exports = Message;
