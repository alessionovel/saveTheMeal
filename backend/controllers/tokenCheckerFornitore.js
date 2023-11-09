const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

const tokenChecker = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  // if there is no token
  if (!token) {
    return res.json({ message: "No token provided" });
  }

  // decode token, verifies secret and checks exp
  jwt.verify(token, process.env.SUPER_SECRET, function (err, decoded) {
    if (err) {
      return res.json({ message: "Failed to authenticate token" });
    } else {
      // if everything is good, save to request for use in other routes
      req.loggedSupplier = decoded;
      next();
    }
  });
};

module.exports = tokenChecker;
