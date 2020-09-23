const router = require("express").Router();

const reportController = require("../controllers/report.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate"),
    { checkToken } = require("../middlewares/auth");

router
    .get("/requests-by-state", checkToken, reportController.getReportRequestsView)
    .post("/report-requests-data", reportController.getReportRequests);

module.exports = router;