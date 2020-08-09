const router = require("express").Router();

const constancyProcessController = require("../controllers/constancyProcess.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate");

router
    .get("/generate-constancy", constancyProcessController.getReviewInProcessInfo)
    .get("/request-in-process", constancyProcessController.getRequestInProcess)
    .get("/request-process-list", constancyProcessController.getRequestInProcessList)
    .post("/filterProcess", constancyProcessController.filterProcess);

module.exports = router;