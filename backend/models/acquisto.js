const { default: mongoose } = require("mongoose");

const acquistoSchema = new mongoose.Schema({
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "meals",
  },
  acquirente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "utentes",
  },
  presenzaIntolleranze: Boolean,
  intolleranze: String,
  isPaid: Boolean,
  borsa: Boolean,
  stato: {
    type: String,
    default: "In attesa",
  },
});

const Acquisto = mongoose.model("Acquisto", acquistoSchema);
module.exports = Acquisto;
