const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const passport = require("passport"); 
const auth = passport.authenticate("jwt", { session: false });

exports.router = (() => {
  var bookingRouter = express.Router();

  // Booking CRUD operations
  bookingRouter.post('/create', auth, bookingController.createBooking);
  bookingRouter.post('/report', auth, bookingController.reportHouse);

  // User bookings and statistics
  bookingRouter.get('/my_bookings', auth, bookingController.getMyBookings);

return bookingRouter;
})();