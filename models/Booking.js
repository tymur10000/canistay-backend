const mongoose = require("mongoose");

const Booking = mongoose.model("bookings", {
  guest_id: { // Reference to the User model (Guest)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  house_id: { // Reference to the House model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'houses',
    required: true,
  },
  start_date: { // Start date of the booking
    type: Date,
    required: true,
  },
  end_date: { // End date of the booking
    type: Date,
    required: true,
  },
  status: { // Status of the booking (Pending, Accepted, Declined, Completed, Cancelled)
    type: String,
    enum: ['Pending', 'Accepted', 'Declined', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  guest_signature: { 
    type: Boolean,
    default: false,
  },
  host_signature: { 
    type: Boolean,
    default: false,
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

module.exports = Booking;