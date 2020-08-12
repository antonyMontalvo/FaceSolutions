const router = require("express").Router();

const constancyProcessController = require("../controllers/constancyProcess.controller"),
  validator = require("../middlewares/validation"),
  authenticate = require("../middlewares/authenticate");

router
  .get("/generate-constancy", constancyProcessController.getReviewInProcessInfo)
  .get("/request-in-process", constancyProcessController.getRequestInProcess)
  .get(
    "/request-process-list",
    constancyProcessController.getRequestInProcessList
  )
  .post("/filterProcess", constancyProcessController.filterProcess)
  .get(
    "/request-process-work/:id",
    constancyProcessController.getRequestProcess
  )
  .get("/redirect-request-process/:id", constancyProcessController.getProcess)
  .get(
    "/redirect-request-process-dni",
    constancyProcessController.getProcessByDni
  );

module.exports = router;
