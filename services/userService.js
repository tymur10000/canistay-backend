var passwordHash = require("password-hash");
var sendmail = require("../services/mailService");
const fs = require("fs");
const path = require("path");

const { sendEmail } = require("../utils/EmailService");
const jwtService = require("../utils/jwtService");

module.exports = {
  sendVerificationEmail: async (data) => {
    const verificationHtml = fs.readFileSync(
      path.join(__dirname, "../templates/verification.html"),
      "utf8"
    );
    const token = jwtService.tokenGenerator(data);
    const link = `${process.env.REDIRECT_URL}/mvp/verify?token=${token}`;
    const html = verificationHtml
      .replace("{{name}}", data[0])
      .replace("{{link}}", link);
    try {
      await sendEmail(
        data.email,
        "Canistaydaddy Email Verification",
        "Please verify your email by clicking this link: " + link,
        html
      );
      return { status: "Successfully email sent" };
    } catch (err) {
      return { status: "Failed to send email" };
    }
  },
  getUser: async (data) => {
    var email = data.email;
    var password = data.password;

    var result = await userModel.findOne("email", email);
    if (result) {
      var hashed = result["password"];
      if (result["status"] == 0) return { error: "Inactive account" };
      if (passwordHash.verify(password, hashed))
        return { message: "Succesfully User Retrieved", userData: result };
      else return { error: "Incorrect email or password" };
    } else return { error: "Incorrect email or password" };
  },

  doesUserLoginExist: async (data) => {
    var user = data.login;

    if (user.match(/@/)) {
      var result = await userModel.findOne("mail", user);
      if (result != "") {
        return { message: "User does exist", userData: result };
      } else return { error: "Incorrect login" };
    } else {
      var result = await userModel.findOne("username", user);
      if (result != "") {
        return { message: "User does exist", userData: result };
      } else return { error: "Incorrect login" };
    }
  },

  getUserIdFromUsername: async (username) => {
    try {
      var result = await userModel.findOne("username", username);
      if (result) return result.id;
      else return { error: "User not found" };
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  getUserData: async (id) => {
    try {
      var result = await userModel.findOne("id", id);
      return result || { error: "User not found" };
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  verifyPasswordWithId: async (pwd, id) => {
    var result = await userModel.findOne("id", id);
    if (result) {
      var hashed = result["password"];
      if (passwordHash.verify(pwd, hashed))
        return { status: "Password is valid" };
      else {
        return { status: "Password isn't valid" };
      }
    }
  },

  updatePasswordWithId: async (pwd, id) => {
    var updated = await userModel.updatePasswordWithId(pwd, id);
    if (updated !== "") {
      return { status: "Password updated with success" };
    } else {
      return { status: "An error has occurred" };
    }
  },

  updatePasswordWithKey: async (pwd, key) => {
    var updated = await userModel.updatePasswordWithKey(pwd, key);
    if (updated) {
      return { status: "Password updated with success" };
    } else {
      return { status: "An error has occurred" };
    }
  },

  getUserTags: async (id) => {
    try {
      var result = await tagModel.findOne(id);
      return result;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  getAllTags: async () => {
    try {
      var result = await tagModel.findAllTags();
      return result;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  resetUserPassword: async (data) => {
    var uniqid = (
      new Date().getTime() + Math.floor(Math.random() * 10000 + 1)
    ).toString(16);
    var created = await userModel.setPasswordResetKey(data[0]["id"], uniqid);
    if (created) {
      var link = "https://www.canistaydaddy.com/users/reset-password/" + uniqid;
      await sendmail.forgotPasswordMail(
        data[0]["mail"],
        data[0]["username"],
        link
      );
      return { status: "Reset password email sent with success" };
    }
  },

  extractBlockedUsers: async (tab, userID) => {
    var blocked = await userModel.getBlockedUsersFromMyId(userID);

    var result = [];
    var i = 0;
    while (i < tab.length) result.push(tab[i++]);

    var i = 0;
    while (i < result.length) {
      var k = 0;
      while (k < blocked.length) {
        if (
          result[i]["user_1"] == blocked[k]["user_id"] ||
          result[i]["user_2"] == blocked[k]["user_id"]
        ) {
          for (var j = 0; j < tab.length; j++)
            if (
              tab[j]["user_1"] == blocked[k]["user_id"] ||
              tab[j]["user_2"] == blocked[k]["user_id"]
            )
              tab.splice(j, 1);
        }
        k++;
      }
      i++;
    }
    return tab;
  },
};
