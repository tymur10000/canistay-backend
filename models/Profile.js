const mongoose = require("mongoose");

const Profile = mongoose.model("profiles", {
  user_id: { // Reference to the User model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  firstname: String,
  lastname: String,
  gender: {
    type: String,
    enum: ["male", "female"],
    default: "male",
  },
  birthdate: Date,
  main_picture: String,
  banner_url: String,
  phone_number: String,
  id_verified: {
    type: Boolean,
    default: false,
  },
  online: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["online", "offline", "away", "busy"],
    default: "offline",
  },
  last_seen: Date,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile;

