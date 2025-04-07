var express = require("express");
var userController = require("../controllers/userController");
const User = require("../models/User");
const passport = require("passport"); 
const auth = passport.authenticate("jwt", { session: false });
const checkSubscription = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user || !user.subscription_active) {
      return res.status(403).json({ status: "error", message: "You must be a premium subscriber." });
  }
  next();
};

exports.router = (() => {
  var userRouter = express.Router();

  // Authentication
  userRouter.post("/login", userController.login); // For login

  userRouter.delete('/delete/:user_id', userController.deleteUser);

  return userRouter;
})();
