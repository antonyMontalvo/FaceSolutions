const router = require("express").Router();

const constancyProcessController = require("../controllers/constancyProcess.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate"),
    { checkToken } = require("../middlewares/auth");

router
    .get("/generate-constancy", checkToken, constancyProcessController.getReviewInProcessInfo)
    .get("/request-in-process", checkToken, constancyProcessController.getRequestInProcess)
    .get(
        "/request-process-list",
        constancyProcessController.getRequestInProcessList
    )
    .post("/filterProcess", constancyProcessController.filterProcess)
    .put("/updatedProcessConstancy", constancyProcessController.updatedConstancy)
    .put("/derivedProcessConstancy", constancyProcessController.derivedConstancy)
    .put("/cancelProcessConstancy", constancyProcessController.cancelConstancy)
    .put("/privateProcessConstancy", constancyProcessController.privateConstancy)
    .get(
        "/request-process-work/:id",
        constancyProcessController.getRequestProcess
    )
    .get("/redirect-request-process/:id", constancyProcessController.getProcess)
    .get(
        "/redirect-request-process-dni2/:dni",
        constancyProcessController.getProcessByDni
    );

module.exports = router;