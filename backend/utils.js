const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

function checkIfEmailInString(text) {
  // eslint-disable-next-line
  var re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(text);
}

const tokenChecker = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  // if there is no token
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "No token provided.",
    });
  }

  // decode token, verifies secret and checks exp
  jwt.verify(token, process.env.SUPER_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({
        success: false,
        message: "Failed to authenticate token.",
      });
    } else {
      // if everything is good, save to request for use in other routes
      req.loggedUser = decoded;
      next();
    }
  });
};

module.exports = {
  checkIfEmailInString,
  tokenChecker,
};
