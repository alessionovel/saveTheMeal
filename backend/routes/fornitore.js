const express = require("express"); //import express
const fornitoreController = require("../controllers/fornitore");
const router2 = express.Router();

router2.post("/fornitore/login", fornitoreController.login);
router2.post("/fornitore", fornitoreController.newFornitore);
router2.get("/fornitore", fornitoreController.getAllFornitore);
router2.delete("/fornitore", fornitoreController.deleteAllFornitore);

router2.get("/fornitore/:id", fornitoreController.getOneFornitore);
router2.delete("/fornitore/:id", fornitoreController.deleteOneFornitore);

module.exports = router2; //export to use in server.js
