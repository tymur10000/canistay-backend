const Premium = require('../models/Premium');
const verifyPremium = async (req, res, next) => {
  const premium = await Premium.findOne({ user_id: req.user._id, end_date: { $gte: new Date() } }).sort({
    end_date: -1,
  });
  if (!premium) {
    return res.status(403).json({ message: "You are not a premium user" });
  }
  next();
};

module.exports = verifyPremium;
