var chatController = require("../controllers/chatController");
var userController = require("../controllers/userController");
const chatModel = require("../models/Message");
var { verifyToken } = require("../utils/jwtService");
const User = require("../models/User");
const Message = require("../models/Message");
const Profile = require("../models/Profile");
const Contact = require("../models/Contact");

module.exports = (io) => {
  var connections = [];
  var clients = [];
  var onlineTab = [];

  var mainSocket = io.on("connection", async (socket) => {
    const query = socket.handshake.query;
    const _id = query["_id"];
    User.findById(_id)
      .then((user) => {
        if (!user) {
          return socket.disconnect();
        }

        // const profile = await profileModel.findOne("user_id", _id);
        socket.join(_id);
        Message.find({ receiver_id: _id, unread: true }).then((messages) => {
          socket.emit("unread", messages);
        });
        Profile.findOne({ user_id: _id }).then((profile) => {
          socket.emit("profile", profile);
        });
        // chatController.onlineStatus(tokenData.id);

        socket.broadcast.emit("updateStatus", {
          user_id: _id,
          status: "online",
        });

        // socket.on("sendNotif", async (type, user_id, target_id) => {
        //   var sendNotif = await userController.manageNotif(
        //     type,
        //     user_id,
        //     target_id
        //   );
        //   var isBlocked = await userModel.checkUserIsBlocked(user_id, target_id);
        //   if (sendNotif && !isBlocked) {
        //     socket.broadcast.emit("newNotif", target_id);
        //   }
        // });

        socket.on("message", (data, callback) => {
          const message = new Message({ ...data, sender_id: user._id });
          message.sender_id = user;
          socket.emit("message.chat", message);
          message.save().then((message) => {
            callback?.(message);
          });
          socket.to(data.contact_id).emit("message.chat", message);
          socket.to(data.contact_id).emit("message.notification", message);
          // chatController.saveNotification(tokenData.id, "message", "", 1);
          // const otherUser = await chatController.getOtherMessageUser(
          //   messageId,
          //   tokenData.id
          // );

          // if (otherUser) {
          //   socket.to(otherUser.user_id).emit("message.chat", {
          //     data: data,
          //     id: messageId,
          //     userID: tokenData.id,
          //     userName: tokenData.firstname + " " + tokenData.lastname,
          //     date: new Date(),
          //     avatar: profile?.main_picture,
          //   });
          //   socket.to(otherUser.user_id).emit("message.notification", {
          //     data: data,
          //     id: messageId,
          //     userID: tokenData.id,
          //     userName: tokenData.firstname + " " + tokenData.lastname,
          //     avatar: profile?.main_picture,
          //   });
          // }
        });

        // socket.on("updateStatus", (status) => {
        //   chatController.saveStatus(status, tokenData.id);
        //   socket.broadcast.emit("updateStatus", {
        //     user_id: tokenData.id,
        //     status: status,
        //   });
        // });
        // socket.on("acceptInvitation", async (data, callback) => {
        //   const otherUser = await chatController.getOtherMessageUser(
        //     data.id,
        //     tokenData.id
        //   );
        //   await chatController.acceptInvitation(data.id, tokenData.id);
        //   callback?.();
        //   if (otherUser) {
        //     socket.to(otherUser.user_id).emit("acceptInvitation.chat", {
        //       ...data,
        //       avatar: otherUser.main_picture,
        //       userName: otherUser.firstname + " " + otherUser.lastname,
        //     });
        //     socket.to(otherUser.user_id).emit("acceptInvitation.notification", {
        //       ...data,
        //       avatar: otherUser.main_picture,
        //       userName: otherUser.firstname + " " + otherUser.lastname,
        //     });
        //   }
        // });
        // socket.on("declineInvitation", async (data, callback) => {
        //   const otherUser = await chatController.getOtherMessageUser(
        //     data.id,
        //     tokenData.id
        //   );
        //   await chatController.declineInvitation(data.id, tokenData.id);
        //   callback?.();
        //   if (otherUser) {
        //     socket.to(otherUser.user_id).emit("declineInvitation.chat", {
        //       ...data,
        //       avatar: otherUser.main_picture,
        //       userName: otherUser.firstname + " " + otherUser.lastname,
        //     });
        //     socket.to(otherUser.user_id).emit("declineInvitation.notification", {
        //       ...data,
        //       avatar: otherUser.main_picture,
        //       userName: otherUser.firstname + " " + otherUser.lastname,
        //     });
        //   }
        // });
        // socket.on("cancelInvitation", async (data, callback) => {
        //   const otherUser = await chatController.getOtherMessageUser(
        //     data.id,
        //     tokenData.id
        //   );
        //   await chatController.cancelInvitation(data.id, tokenData.id);
        //   callback?.();
        //   if (otherUser) {
        //     socket.to(otherUser.user_id).emit("cancelInvitation.chat", {
        //       ...data,
        //       userName: otherUser.firstname + " " + otherUser.lastname,
        //       avatar: otherUser.main_picture,
        //     });
        //     socket.to(otherUser.user_id).emit("cancelInvitation.notification", {
        //       ...data,
        //       avatar: otherUser.main_picture,
        //       userName: otherUser.firstname + " " + otherUser.lastname,
        //     });
        //   }
        // });
        // socket.on("read_messages", async (room_id) => {
        //   chatModel.readMessage(room_id, tokenData.id);
        // });
        // socket.on("swipe", async (data, callback) => {
        //   const count = await matchModel.getTodayFeeSwipeCount(tokenData.id);
        //   const superLikeCount = await matchModel.getTodaySwipeSuperlikeCount(
        //     tokenData.id
        //   );
        //   if (data.swipe === "superlike" && superLikeCount <= 0) {
        //     return callback({
        //       error: {
        //         title: "You've used all your superlikes for today!",
        //         content: "Come back tomorrow for more.",
        //       },
        //     });
        //   }
        //   if (count > 0) {
        //     const swiped = await matchModel.swipeUser(
        //       tokenData.id,
        //       data.user_id,
        //       data.swipe
        //     );
        //     if (!swiped) {
        //       return callback({
        //         error: {
        //           content: "User already swiped",
        //         },
        //       });
        //     }
        //     if (profile) {
        //       const result = await matchModel.getNewSwiping(
        //         tokenData.id,
        //         profile.gender === "male" ? "female" : "male",
        //         profile.min_age,
        //         profile.max_age,
        //         profile.min_distance,
        //         profile.max_distance,
        //         profile.longitude,
        //         profile.latitude
        //       );
        //       callback(result ? { free_swipe: count - 1, ...result } : null);
        //     }
        //   } else {
        //     callback({
        //       error: {
        //         title: "You've used all your free swipes for today!",
        //         content: "Come back tomorrow for more.",
        //       },
        //     });
        //   }
        // });
        // socket.on("acceptSuperlike", async (data, callback) => {
        //   const match = await matchModel.createMatch(data.id, tokenData.id);
        //   callback?.(match);
        //   socket.to(data.id).emit("acceptSuperlike", tokenData.id);
        // });
        // socket.on("declineSuperlike", async (data, callback) => {
        //   const match = await matchModel.updateSwipes(
        //     tokenData.id,
        //     data.id,
        //     "dislike"
        //   );
        //   callback?.(match);
        //   socket.to(data.id).emit("declineSuperlike", tokenData.id);
        // });
        // socket.on("acceptLike", async (data, callback) => {
        //   const match = await matchModel.createMatch(data.id, tokenData.id);
        //   callback?.(match);
        //   socket.to(data.id).emit("acceptLike", tokenData.id);
        // });
        // socket.on("declineLike", async (data, callback) => {
        //   const match = await matchModel.updateSwipes(
        //     tokenData.id,
        //     data.id,
        //     "dislike"
        //   );
        //   socket.to(data.id).emit("declineLike", tokenData.id);
        //   callback?.(match);
        // });
        // socket.on("disconnect", (reason) => {
        //   chatController.offlineStatus(tokenData.id);
        //   socket.broadcast.emit("updateStatus", {
        //     user_id: tokenData.id,
        //     status: "offline",
        //   });
        //   for (var i = 0; i < onlineTab.length; i++) {
        //     if (onlineTab[i]["socketID"] == socket.id) onlineTab.splice(i, 1);
        //   }
        //   var result = onlineTab.find((elem) => elem.userID === query["id"]);
        //   if (result === undefined) {
        //     socket.broadcast.emit("offline", {
        //       user_id: query["id"],
        //       status: "Offline",
        //     });
        //   }
        // });
      })
      .catch((err) => {
        return socket.disconnect();
      });
  });
};
