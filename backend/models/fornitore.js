const { default: mongoose } = require("mongoose");

const fornitoreSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nomeAttivita: {
    type: String,
    unique: true,
    required: true,
  },
  indirizzoNegozio: {
    type: String,
    required: true,
  },
  tipologiaAlimenti: {
    type: String,
  },
  IBAN: {
    type: String,
    required: true,
  },
  immagine: {
    type: String,
  },
  //manca coordinate (no perchè sono già nell'indirizzo)
});

const Fornitore = mongoose.model("Fornitore", fornitoreSchema);
module.exports = Fornitore;
