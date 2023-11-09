const { default: mongoose } = require("mongoose");

const mealSchema = new mongoose.Schema({
  fornitore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "fornitores",
    required: true,
  },
  prezzo: {
    type: Number,
    required: true,
  },
  dimensione: {
    type: String,
    required: true,
  },
  disponibilita: {
    type: Boolean,
    required: true,
    default: true,
  },
  //manca data e fascia oraria
});

const Meal = mongoose.model("Meal", mealSchema);
module.exports = Meal;
