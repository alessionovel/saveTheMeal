const express = require("express"); //import express
const utenteController = require("../controllers/utente");
const router3 = express.Router();

router3.post("/utente/login", utenteController.login);
router3.post("/utente", utenteController.newUtente);
router3.get("/utente", utenteController.getAllUtente);

module.exports = router3; //export to use in server.js
