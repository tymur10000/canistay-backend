const mongoose = require("mongoose");

const Service = require("./Service");

const House = mongoose.model("houses", {
  owner_id: {
    // Reference to the User model (Homeowner)
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  title: {
    // Title of the property listing
    type: String,
    required: true,
  },
  rooms: {
    // Number of rooms in the property
    type: Number,
    default: 1,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = House;
