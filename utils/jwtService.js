var jwt = require("jsonwebtoken");

const SECRET_KEY =
  process.env.SECRET_KEY ||
  "a5f0f80f2a0012236be249d8351d5fd913ff7e666f70d5704940f0a02a39ab4989fd1cd69b3f5bcb04bc5eedc1a803c43bd87f90e9f3f3e3fb7cd0cbb0b912c5";

module.exports = {
  tokenGenerator: (userData, expiresIn = "24h") => {
    var jwt_token = jwt.sign(userData, SECRET_KEY, {
      expiresIn,
    });
    return jwt_token;
  },

  parseAuthorization: (authorization) => {
    return authorization != null ? authorization.replace("Bearer ", "") : null;
  },

  getUserId: (authorization) => {
    var userId = -1;
    var token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      try {
        var jwtToken = jwt.verify(token, SECRET_KEY);
        if (jwtToken != null) userId = jwtToken.id;
      } catch (err) {}
    }
    return userId;
  },

  verifyToken: (token) => {
    try {
      if (token) {
        if (token.includes("Bearer")) token = token.replace("Bearer ", "");
        const decoded = jwt.decode(token, SECRET_KEY);
        if (decoded) {
          if (decoded.exp > Date.now() / 1000) return decoded;
          else return "expired";
        }
      }
      return null;
    } catch (err) {
      return null;
    }
  },

  getTokenData: (token) => {
    try {
      if (token) {
        if (token.includes("Bearer")) token = token.replace("Bearer ", "");
        const decoded = jwt.decode(token, SECRET_KEY);
        if (decoded) {
          return decoded;
        }
      }
      return null;
    } catch (err) {
      return null;
    }
  },
};
