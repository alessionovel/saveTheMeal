const express = require("express"); //import express
const acquistoController = require("../controllers/acquisto");
const tokenCheckerUser = require("../controllers/tokenCheckerUser");
const router5 = express.Router();

router5.post("/acquisto", acquistoController.newAcquisto);
router5.get("/acquisto", acquistoController.getAllAcquisto);

router5.get("/acquisto/:id", acquistoController.getOneAcquisto);
router5.post("/acquisto/:id", acquistoController.updateAcquisto);

module.exports = router5;
