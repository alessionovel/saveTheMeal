const { default: mongoose } = require("mongoose");
const Feedback = require("../models/feedback");
const Meal = require("../models/meal");
const Acquisto = require("../models/acquisto");
const Utils = require("../utils");

const getAllFeedback = (req, res, next) => {
  if (
    req.query.hasOwnProperty("fornitore") &&
    req.query.hasOwnProperty("utente")
  ) {
    fornitore = req.query.fornitore;
    utente = req.query.utente;
    Feedback.find({ fornitore: fornitore, utente: utente }, (err, data) => {
      if (err || !data) {
        return res.json({
          message: "Error.",
        });
      } else return res.json(data); //return the meal object if found
    });
  } else if (req.query.hasOwnProperty("fornitore")) {
    fornitore = req.query.fornitore;
    Feedback.find({ fornitore: fornitore }, (err, data) => {
      if (err || !data || data.length == 0) {
        return res.json({
          message: "Feedbacks don't exist from this supplier.",
        });
      } else return res.json(data); //return the meal object if found
    });
  } else {
    Feedback.find({}, (err, data) => {
      if (err) {
        return res.json({ Error: err });
      }
      return res.json(data);
    });
  }
};
const newFeedback = (req, res, next) => {
  feedback = req.body;
  if (
    feedback.hasOwnProperty("fornitore") &&
    feedback.hasOwnProperty("utente") &&
    feedback.hasOwnProperty("valutazione") &&
    feedback.hasOwnProperty("puntiDiForza") &&
    feedback.hasOwnProperty("commento")
  ) {
    Acquisto.aggregate([
      {
        $lookup: {
          from: "meals",
          localField: "meal",
          foreignField: "_id",
          as: "mealData",
        },
      },
      {
        $unwind: {
          path: "$mealData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $and: [
            { acquirente: mongoose.Types.ObjectId(feedback.utente) },
            {
              "mealData.fornitore": mongoose.Types.ObjectId(feedback.fornitore),
            },
          ],
        },
      },
    ]).exec(function (err, data) {
      if (data.length > 0) {
        Feedback.findOne(
          { utente: feedback.utente, fornitore: feedback.fornitore },
          (err, data) => {
            if (!data) {
              const newFeedback = new Feedback({
                fornitore: feedback.fornitore,
                utente: feedback.utente,
                valutazione: feedback.valutazione,
                puntiDiForza: feedback.puntiDiForza,
                commento: feedback.commento,
              });
              newFeedback.save((err, data) => {
                if (err) return res.json({ Error: err });
                return res.json(data);
              });
            } else {
              if (err)
                return res.json(
                  `Something went wrong, please try again. ${err}`
                );
              return res.json({
                message: "You've already make a feedback for this store",
              });
            }
          }
        );
      } else {
        return res.json({
          message: "You can't make a feedback before buying from the store",
        });
      }
    });
  } else {
    return res.json({ message: "Feedback object required" });
  }
};

const deleteFeedback = (req, res, next) => {
  id = req.params["id"];
  Feedback.findOne({ _id: id }, (err, data) => {
    if (err || !data) {
      return res.json({ message: "Feedback doesn't exist." });
    } else
      Feedback.deleteOne({ _id: id }, (err) => {
        if (err) {
          return res.json({ message: "Complete delete failed" });
        }
        return res.json({ message: "Complete delete successful" });
      });
  });
};

module.exports = {
  getAllFeedback,
  newFeedback,
  deleteFeedback,
};
