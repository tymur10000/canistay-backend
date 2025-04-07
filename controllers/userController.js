const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const moment = require("moment");
const validator = require("validator");
const passwordHash = require("password-hash");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Premium = require("../models/Premium");

const verifyIdCard = require("../utils/IdVerificationService");
const { sendVerificationCode, verifyCode } = require("../utils/SmsService");
const User = require("../models/User");
var UserService = require("../services/userService");
var Profile = require("../models/Profile");
var jwtService = require("../utils/jwtService");

const extractCity = (address) => {
  const cityMatch = address.split(",")[0].trim();
  return cityMatch.toUpperCase();
};

const normalizeLocation = (str) => {
  return str
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
};

// Define PLANS object that maps plan keys to Stripe price IDs
const PLANS = {
  basic: process.env.STRIPE_BASIC_PLAN_ID,    // e.g., "price_H5j6JkL7m8n9"
  elite: process.env.STRIPE_ELITE_PLAN_ID,    // e.g., "price_A1b2C3d4E5f6"
  vip: process.env.STRIPE_VIP_PLAN_ID        // e.g., "price_X9y8Z7w6V5u4"
};

module.exports = {
  login: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          status: "error",
          error: "Username or password is incorrect",
        });
      }
      const isPasswordValid = passwordHash.verify(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          status: "error",
          error: "Username or password is incorrect",
        });
      }
      const token = jwtService.tokenGenerator(
        {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        },
        "24h"
      );
      const premium = await Premium.findOne({
        user_id: user._id,
        end_date: { $gte: new Date() },
      }).sort({
        end_date: -1,
      });
      const profile = await Profile.findById(user._id);
      return res.status(200).json({
        status: "success",
        token: token,
        user: user,
        profile: profile,
        premium: premium ? {
          plan: premium.plan,
          end_date: premium.end_date,
          status: premium.status
        } : null,
      });
    } catch (err) {
      return res
        .status(400)
        .json({ status: "error", error: "Username or password is incorrect" });
    }
  },

  createUser: async (req, res) => {
    try {
      const firstname = req.body.firstname;
      const lastname = req.body.lastname;
      const email = req.body.email;
      const password = req.body.password;

      //Check inputs
      if (validator.isEmpty(email)) {
        return res.status(400).json({ error: "Email is required" });
      }
      if (validator.isEmpty(password)) {
        return res.status(400).json({ error: "Password is required" });
      }
      if (validator.isEmpty(firstname)) {
        return res.status(400).json({ error: "Firstname is required" });
      }
      if (validator.isEmpty(lastname)) {
        return res.status(400).json({ error: "Lastname is required" });
      }
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email" });
      }
      if (!validator.isLength(password, { min: 8 })) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters long" });
      }
      if (!validator.isLength(firstname, { min: 2, max: 30 })) {
        return res
          .status(400)
          .json({ error: "Firstname must be between 2 and 30 characters" });
      }
      if (!validator.isLength(lastname, { min: 2, max: 30 })) {
        return res
          .status(400)
          .json({ error: "Lastname must be between 2 and 30 characters" });
      }

      if (await User.findOne({ email })) {
        return res
          .status(400)
          .json({ status: "error", error: "Email already exists" });
      }
      const hashedPassword = passwordHash.generate(password, {
        algorithm: "sha512",
        saltLength: 10,
        iterations: 5,
      });
      const newUser = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      });
      //Create new user
      newUser
        .save()
        .then((user) => {
          UserService.sendVerificationEmail({
            _id: user._id,
            firstname,
            lastname,
            email,
          }).then((result) => {
            console.log(result);
          });
          const token = jwtService.tokenGenerator(
            {
              _id: user._id,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
            },
            "24h"
          );
          return res.status(200).json({
            status: "success",
            token: token,
            user: user,
            profile: null,
          });
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      return res.status(400).json({ error: "Failed to create user" });
    }
  },
  verifyEmail: async (req, res) => {
    try {
      const decoded = jwtService.verifyToken(req.body.token);
      // Check if the decoded object is an object
      if (typeof decoded === "object") {
        if ((await User.findById(decoded._id)).email_verified) {
          return res.status(400).json({
            status: "error",
            error: "Email already verified",
          });
        }
        await User.updateOne(
          { email: decoded.email },
          { email_verified: true }
        );
        return res.status(200).json({
          token: jwtService.tokenGenerator(decoded, "24h"),
          user: decoded,
          status: "success",
        });
      } else if (decoded === "expired") {
        return res.status(400).json({
          status: "error",
          error: "Expired token",
        });
      } else {
        return res.status(400).json({
          status: "error",
          error: "Invalid token",
        });
      }
    } catch (err) {
      return res.status(400).json({
        status: "error",
        error: "Please try again.",
      });
    }
  },
  verifyToken: async (req, res) => {
    const profile = await Profile.findOne({ user_id: req.user._id });
    const premium = await Premium.findOne({
      user_id: req.user._id,
      end_date: { $gte: new Date() },
    }).sort({
      end_date: -1,
    });
    return res.status(200).json({
      message: {
        status: "success",
        content: "Token is valid",
      },
      user: req.user,
      profile: profile,
      premium: premium ? {
        plan: premium.plan,
        end_date: premium.end_date,
        status: premium.status
      } : null,
    });
  },

  googleAuth: async (req, res) => {
    const { tokenType, token } = req.body;

    if (tokenType === "Bearer") {
      try {
        // Verify the token using Google's OAuth2 client
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
    
      return res.status(200).json({
        status: "success",
        message: "Subscription will be canceled at the end of the current billing period",
        data: {
          subscriptionId: canceledSubscription.id,
          plan: activePremium.plan,
          endDate: new Date(canceledSubscription.current_period_end * 1000),
          cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end
        }
      });
      
    } catch (error) {
      console.error("Cancel subscription error:", error);
      return res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  },
};
