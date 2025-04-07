const express = require("express");
const router = express.Router();
const houseController = require("../controllers/houseController");
const passport = require("passport");
const auth = passport.authenticate("jwt", { session: false });
const verifyPremium = require('../middleware/verifyPremium');

exports.router = (() => {
  var houseRouter = express.Router();
  // Public routes
  houseRouter.post("/search", houseController.searchHouses);
  houseRouter.post("/create", [auth, verifyPremium], houseController.createHouse);

  return houseRouter;
})();
