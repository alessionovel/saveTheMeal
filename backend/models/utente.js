const { default: mongoose } = require("mongoose");

const utenteSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nome: {
    type: String,
  },
  cognome: {
    type: String,
  },
});

const Utente = mongoose.model("Utente", utenteSchema);
module.exports = Utente;
