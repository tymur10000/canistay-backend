const mongoose = require("mongoose");
const moment = require("moment");

const User = mongoose.model("users", {
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  birthdate: Date,
  main_picture : {type: String},
  intro_video : {type: String},
  status: {
    type: String,
    enum: ["online", "offline", "away", "busy"],
    default: "offline",
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['host', 'guest'],
    default: 'guest',
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  approval_status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  is_profile_completed: {
    type: Boolean,
    default: false,
  },
  is_id_verified: {
    type: Boolean,
    default: false,
  },
  subscription_active: { type: Boolean, default: true },
  subscription_id: String,
  blocked_users: [{type: String}],
  created_at: {
    type: Date,
    default: moment().format("YYYY-MM-DD HH:mm:ss"),
  },
  updated_at: {
    type: Date,
    default: moment().format("YYYY-MM-DD HH:mm:ss"),
  },
});

module.exports = User;
