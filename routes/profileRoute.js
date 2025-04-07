var express = require("express");
var profileController = require("../controllers/profileController");
const passport = require("passport"); 
const auth = passport.authenticate("jwt", { session: false });

exports.router = (() => {
  var profileRouter = express.Router();

  profileRouter.post("/profile", auth, profileController.createUserProfile); // For create profile
  profileRouter.post('/unblock-user', auth, profileController.unblockUser);

  return profileRouter;
})();
