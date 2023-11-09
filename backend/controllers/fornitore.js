const Fornitore = require("../models/fornitore");
const Utils = require("../utils");
const jwt = require("jsonwebtoken");

const login = async function (req, res, next) {
  utente = req.body;
  if (utente.hasOwnProperty("email") && utente.hasOwnProperty("password")) {
    // find the user
    let user = await Fornitore.findOne({
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
        email: user.email,
        nomeAttivita: user.nomeAttivita,
        indirizzoNegozio: user.indirizzoNegozio,
        // other data encrypted in the token
      };
      var options = {
        expiresIn: 86400, // expires in 24 hours
      };
      var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

      res.json({
        token: token,
        id: user._id,
        email: user.email,
        nomeAttivita: user.nomeAttivita,
        indirizzoNegozio: user.indirizzoNegozio,
        //self: "api/v1/" + user._id
      });
    }
  } else {
    return res.json({ message: "Fornitore credentials required" });
  }
};
//GET '/fornitore'
const getAllFornitore = (req, res, next) => {
  Fornitore.find({}, (err, data) => {
    if (err) {
      return res.json({ Error: err });
    }
    return res.json(data);
  });
};
//POST '/Fornitore'
const newFornitore = (req, res, next) => {
  fornitore = req.body;
  if (
    fornitore.hasOwnProperty("email") &&
    fornitore.hasOwnProperty("password") &&
    fornitore.hasOwnProperty("nomeAttivita") &&
    fornitore.hasOwnProperty("indirizzoNegozio") &&
    fornitore.hasOwnProperty("tipologiaAlimenti") &&
    fornitore.hasOwnProperty("IBAN") &&
    fornitore.hasOwnProperty("immagine")
  ) {
    if (
      typeof fornitore.email != "string" ||
      !Utils.checkIfEmailInString(fornitore.email)
    ) {
      res.json({
        success: false,
        message:
          'The field "email" must be a non-empty string, in email format',
      });
      return;
    } else {
      //check if the Fornitore name already exists in db
      Fornitore.findOne(
        {
          $or: [
            { nomeAttivita: fornitore.nomeAttivita },
            { email: fornitore.email },
          ],
        },
        (err, data) => {
          //if fornitore not in db, add it

          if (!data) {
            //create a new fornitore object using the fornitore model and req.body
            const nuovoFornitore = new Fornitore({
              email: fornitore.email,
              password: fornitore.password,
              nomeAttivita: fornitore.nomeAttivita,
              indirizzoNegozio: fornitore.indirizzoNegozio,
              tipologiaAlimenti: fornitore.tipologiaAlimenti,
              IBAN: fornitore.IBAN,
              immagine: fornitore.immagine,
            });
            // save this object to database
            nuovoFornitore.save((err, data) => {
              if (err) return res.json({ Error: err });
              return res.json(data);
            });
            //if there's an error or the fornitore is in db, return a message
          } else {
            if (err)
              return res.json(`Something went wrong, please try again. ${err}`);
            return res.json({ message: "Fornitore already exists" });
          }
        }
      );
    }
  } else {
    return res.json({ message: "Fornitore object required" });
  }
};
//DELETE '/fornitore'
const deleteAllFornitore = (req, res, next) => {
  Fornitore.deleteMany({}, (err) => {
    if (err) {
      return res.json({ message: "Complete delete failed" });
    }
    return res.json({ message: "Complete delete successful" });
  });
};
//GET '/fornitore/:email'
const getOneFornitore = (req, res, next) => {
  id = req.params["id"]; //get the fornitore email
  //find the specific fornitore with that email
  Fornitore.findOne({ _id: id }, (err, data) => {
    if (err || !data) {
      return res.json({ message: "Fornitore doesn't exist." });
    } else return res.json(data); //return the fornitore object if found
  });
};
//DELETE '/fornitore/:email'
const deleteOneFornitore = (req, res, next) => {
  id = req.params["id"];
  Fornitore.findOne({ _id: id }, (err, data) => {
    if (err || !data) {
      return res.json({ message: "Fornitore doesn't exist." });
    } else
      Fornitore.deleteOne({ _id: id }, (err) => {
        if (err) {
          return res.json({ message: "Complete delete failed" });
        }
        return res.json({ message: "Complete delete successful" });
      });
  });
};
//export controller functions
module.exports = {
  getAllFornitore,
  newFornitore,
  deleteAllFornitore,
  getOneFornitore,
  deleteOneFornitore,
  login,
}; //per poterlo utilizzare in altri file
