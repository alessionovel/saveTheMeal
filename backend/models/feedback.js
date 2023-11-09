const { default: mongoose } = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  fornitore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "fornitores",
    required: true,
  },
  utente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "utentes",
    required: true,
  },
  valutazione: {
    type: Number,
    required: true,
  },
  puntiDiForza: {
    type: String,
  },
  commento: {
    type: String,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
