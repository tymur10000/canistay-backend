var express = require("express");
var chatController = require("../controllers/chatController");

const passport = require("passport");
const auth = passport.authenticate("jwt", { session: false });

exports.router = (() => {
  var chatRouter = express.Router();

  chatRouter.get("/contacts", auth, chatController.getContacts);
  chatRouter.get("/messages/:contact_id", auth, chatController.getMessages);

  return chatRouter;
})();
