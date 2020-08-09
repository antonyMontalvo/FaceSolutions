const router = require("express").Router();

const constancyProcessController = require("../controllers/constancy.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate");

router
    .get("/generate-constancy", constancyProcessController.getReviewInProcessInfo)
    .get("/request-in-process", constancyProcessController.getRequestInProcessList);
module.exports = router;