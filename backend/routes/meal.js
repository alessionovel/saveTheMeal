const express = require("express"); //import express
const mealController = require("../controllers/meal");
const tokenCheckerFornitore = require("../controllers/tokenCheckerFornitore");
const router = express.Router();

router.post("/meal", mealController.newMeal);
router.get("/meal", mealController.getAllMeal);
router.delete("/meal", mealController.deleteAllMeal);

router.get("/meal/:id", mealController.getOneMeal);
router.delete("/meal/:id", mealController.deleteOneMeal);

module.exports = router; //export to use in server.js
