const { default: mongoose } = require("mongoose");
const Acquisto = require("../models/acquisto");
const Meal = require("../models/meal");
const Utente = require("../models/utente");

const getAllAcquisto = (req, res, next) => {
  if (req.query.hasOwnProperty("utente")) {
    utente = req.query.utente;
    Acquisto.find({ acquirente: utente }, (err, data) => {
      if (err || !data || data.length == 0) {
        return res.json({
          message: "Purchases don't exist from this user.",
        });
      } else return res.json(data); //return the meal object if found
    });
  } else {
    Acquisto.find({}, (err, data) => {
      if (err) {
        return res.json({ Error: err });
      }
      return res.json(data);
    });
  }
};
const newAcquisto = (req, res, next) => {
  acquisto = req.body;
  if (
    acquisto.hasOwnProperty("meal") &&
    acquisto.hasOwnProperty("acquirente") &&
    acquisto.hasOwnProperty("presenzaIntolleranze") &&
    acquisto.hasOwnProperty("intolleranze") &&
    acquisto.hasOwnProperty("isPaid") &&
    acquisto.hasOwnProperty("borsa") &&
    acquisto.hasOwnProperty("stato")
  ) {
    Meal.aggregate([
      {
        $lookup: {
          from: "acquistos",
          localField: "_id",
          foreignField: "meal",
          as: "acquisto",
        },
      },
      {
        $unwind: {
          path: "$acquisto",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: { _id: mongoose.Types.ObjectId(acquisto.meal) } },
    ]).exec(function (err, data) {
      disponibile = true;
      for (let i = 0; i < data.length; i++) {
        let meal = data[i];
        if (
          meal.disponibilita == false ||
          (meal.hasOwnProperty("acquisto") &&
            meal.acquisto.stato != "rifiutato")
        ) {
          disponibile = false;
        }
      }
      if (disponibile && data.length > 0) {
        Utente.findOne({ _id: acquisto.acquirente }, (err, data) => {
          if (data) {
            //create a new acquisto object using the acquisto model and req.body
            const newAcquisto = new Acquisto({
              meal: acquisto.meal,
              acquirente: acquisto.acquirente,
              presenzaIntolleranze: acquisto.presenzaIntolleranze,
              intolleranze: acquisto.intolleranze,
              isPaid: acquisto.isPaid,
              borsa: acquisto.borsa,
              stato: acquisto.stato,
            });
            // save this object to database
            newAcquisto.save((err, data) => {
              if (err) {
                return res.json({ Error: err });
              } else {
                Meal.findOneAndUpdate(
                  { _id: acquisto.meal },
                  { disponibilita: false },
                  { upsert: true },
                  function (err, doc) {
                    if (err) return res.send(500, { error: err });

                    return res.json(data);
                  }
                );
              }
            });
          } else {
            if (err)
              return res.json(`Something went wrong, please try again. ${err}`);
            return res.json({ message: "The user doesn't exists" });
          }
        });
      } else {
        return res.json({ message: "The meal isn't available" });
      }
    });
  } else {
    return res.json({ message: "Acquisto object required" });
  }
};
const getOneAcquisto = (req, res, next) => {
  codiceID = req.params["id"]; //get the meal ID
  //find the specific meal with that ID
  Acquisto.findOne({ meal: codiceID }, (err, data) => {
    if (err || !data) {
      return res.json({ message: "Acquisto doesn't exist." });
    } else return res.json(data); //return the acquisto object if found
  });
};

const updateAcquisto = (req, res, next) => {
  id = req.params["id"]; //get the meal ID
  acquisto = req.body;
  if (acquisto.hasOwnProperty("stato")) {
    stato = acquisto.stato;
    Acquisto.findOneAndUpdate({ _id: id }, { stato: stato }, (err, data) => {
      if (err || !data) {
        return res.json({ message: "Acquisto doesn't exist." });
      } else {
        if (stato == "rifiutato") {
          Meal.findOneAndUpdate(
            { _id: data.meal },
            { disponibilita: "true" },
            (err, data) => {
              if (err || !data) {
                return res.json({ message: "Meal doesn't exist." });
              } else {
              }
              return res.json(data); //return the acquisto object if found
            }
          );
        }
        return res.json(data); //return the acquisto object if found
      }
    });
  } else {
    return res.json({ message: "Stato required" });
  }
};

module.exports = {
  getAllAcquisto,
  newAcquisto,
  getOneAcquisto,
  updateAcquisto,
};
