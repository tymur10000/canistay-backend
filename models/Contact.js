const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  users_id: { type: [mongoose.Schema.Types.ObjectId], ref: "users" },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("contacts", contactSchema);
