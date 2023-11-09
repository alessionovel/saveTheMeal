const express = require("express"); //import express
const feedbackController = require("../controllers/feedback");
const tokenCheckerUser = require("../controllers/tokenCheckerUser");
const router4 = express.Router();

router4.get("/feedback", feedbackController.getAllFeedback);
router4.post("/feedback", feedbackController.newFeedback);
router4.delete("/feedback/:id", feedbackController.deleteFeedback);

module.exports = router4;
