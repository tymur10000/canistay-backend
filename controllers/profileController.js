const Profile = require("../models/Profile");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const moment = require("moment");
const { verifyIdCard } = require("../utils/IdVerificationService");
const jwtService = require("../utils/jwtService");
const passwordHash = require("password-hash");
const House = require("../models/House");

// Helper functions
const generateHashedPassword = (password) => {
  return passwordHash.generate(password, {
    algorithm: "sha512",
    saltLength: 10,
    iterations: 5,
  });
};

  
  updatePassword: async (req, res) => {
    try {
      const userId = req.user._id;
      const { current_password, new_password } = req.body;

      // Input validation
      if (!new_password || new_password.length < 8) {
        return res.status(400).json({
          status: "error",
          message: "New password must be at least 8 characters long",
        });
      }

      // Find user with single query and handle non-existent user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      // Handle first time password setting
      if (!user.password) {
        const hashedPassword = await generateHashedPassword(new_password);
        await updateUserPassword(userId, hashedPassword);

        return res.status(200).json({
          status: "success",
          message: "Password set successfully",
        });
      }

      // Validate current password
      if (
        !current_password ||
        !passwordHash.verify(current_password, user.password)
      ) {
        return res.status(401).json({
          status: "error",
          message: "Current password is incorrect",
        });
      }

      // Prevent setting the same password
      if (passwordHash.verify(new_password, user.password)) {
        return res.status(400).json({
          status: "error",
          message: "New password must be different from current password",
        });
      }

      // Update password
      const hashedPassword = await generateHashedPassword(new_password);
      await updateUserPassword(userId, hashedPassword);

      return res.status(200).json({
        status: "success",
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Update password error:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to update password",
      });
    }
  },

};
