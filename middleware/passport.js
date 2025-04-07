const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt; 
const User = require("../models/User");

const options = {
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      // Find user by id from JWT payload
      const user = await User.findOne({ email: jwt_payload.email });
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
