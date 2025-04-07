const Booking = require("../models/Booking");
const House = require("../models/House");

module.exports = {
  // Create a new booking request
  reportHouse: async (req, res) => {
    try {
      const { house_id, reason, comment } = req.body;
      const userId = req.user._id;

      const house = await House.findById(house_id);

      if (!house) {
        return res.status(404).json({
          status: "error",
          message: "House not found"
        });
      }

      // Create new report
      const report = {
        user_id: userId,
        reason,
        comment,
        created_at: new Date()
      };

      const updatedHouse = await House.findByIdAndUpdate(
        house_id,
        {
          $push: { reports: report }
        },
        { new: true }
      );

      return res.status(200).json({
        status: "success",
        message: "House reported successfully",
        data: { house: updatedHouse }
      });
    } catch (error) {
      console.error("Report house error:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to report house"
      });
    }
  }
};
