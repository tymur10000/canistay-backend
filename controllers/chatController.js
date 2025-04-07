var chatModel = require("../models/Message");
const Message = require("../models/Message");
const Contact = require("../models/Contact");
const User = require("../models/User");
const sharp = require("sharp");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
  getUserInfo: async (req, res) => {
    const contact = await User.findById(req.params.contact_id)
      .select("_id firstname lastname main_picture")
      .lean();

    if (!contact) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({
      status: "success",
      user: contact,
    });
  },

  createChatRoom: async (user_id, target_id, username) => {
    var uniqid = (
      new Date().getTime() + Math.floor(Math.random() * 10000 + 1)
    ).toString(16);
    var username_1 = username;
    var username_2 = await userModel.getUsernameFromId(target_id);
    username_2 = username_2[0].username;
    await chatModel.createChatRoom([
      uniqid,
      user_id,
      target_id,
      username_1,
      username_2,
    ]);
    return uniqid;
  },
  getStickerGroups: async (req, res) => {
    try {
      const groups = await chatModel.getStickerGroups();
      return res.status(200).json({ groups });
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  getStickersByGroupId: async (req, res) => {
    const groupId = req.params.group_id;
    const stickers = await chatModel.getStickersByGroupId(groupId);
    return res.status(200).json({ stickers });
  },

      return res.status(500).json({
        status: "error",
        message: "Error uploading file chunk",
        error: error.message,
      });
    }
  },
};
