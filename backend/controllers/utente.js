const Utente = require("../models/utente"); // get our mongoose model
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const Utils = require("../utils");

// ---------------------------------------------------------
// route to authenticate and get a new token
// --------------------------------------------------------
//GET '/utente'
const login = async function (req, res, next) {
  utente = req.body;
  if (utente.hasOwnProperty("email") && utente.hasOwnProperty("password")) {
    // find the user
    let user = await Utente.findOne({
      email: utente.email,
    }).exec();

    // user not found
    if (!user) {
      res.json({
        success: false,
        message: "Authentication failed. User not found.",
      });
    }

    // check if password matches
    else if (user.password != utente.password) {
      res.json({
        success: false,
        message: "Authentication failed. Wrong password.",
      });
    } else {
      // if user is found and password is right create a token
      var payload = {
        id: user._id,
        email: user.email,
        nome: user.nome,
        cognome: user.cognome,
        // other data encrypted in the token
      };
      var options = {
        expiresIn: 86400, // expires in 24 hours
      };
      var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

      res.json({
        id: user._id,
        token: token,
        email: user.email,
        nome: user.nome,
        cognome: user.cognome,
        //self: "api/v1/" + user._id
      });
    }
  } else {
    return res.json({ message: "Utente object required" });
  }
};

const newUtente = (req, res, next) => {
  utente = req.body;
  if (
    utente.hasOwnProperty("email") &&
    utente.hasOwnProperty("password") &&
    utente.hasOwnProperty("nome") &&
    utente.hasOwnProperty("cognome")
  ) {
    if (
      typeof utente.email != "string" ||
      !Utils.checkIfEmailInString(utente.email)
    ) {
      res.json({
        message:
          'The field "email" must be a non-empty string, in email format',
      });
      return;
    }
    //check if the Utente name already exists in db
    Utente.findOne({ email: utente.email }, (err, data) => {
      //if Utente not in db, add it

      if (!data) {
        //create a new Utente object using the Utente model and req.body
        const newUtente = new Utente({
          email: utente.email,
          password: utente.password,
          nome: utente.nome,
          cognome: utente.cognome,
        });
        // save this object to database
        newUtente.save((err, data) => {
          if (err) return res.json({ Error: err });
          return res.json(data);
        });
        //if there's an error or the Utente is in db, return a message
      } else {
        if (err)
          return res.json(`Something went wrong, please try again. ${err}`);
        return res.json({ message: "User already exists" });
      }
    });
  } else {
    return res.json({ message: "Utente credentials required" });
  }
};
const getAllUtente = (req, res, next) => {
  Utente.find({}, (err, data) => {
    if (err) {
      return res.json({ Error: err });
    }
    return res.json(data);
  });
};

//export controller functions
module.exports = {
  login,
  newUtente,
  getAllUtente,
}; //per poterlo utilizzare in altri file
