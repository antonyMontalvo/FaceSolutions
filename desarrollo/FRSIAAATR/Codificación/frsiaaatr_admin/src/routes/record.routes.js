const router = require("express").Router();

const recordController = require("../controllers/record.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate"),
    { checkToken } = require("../middlewares/auth");

router
    .get("/requests-record", checkToken, recordController.getRequestsRecords)
    .get("/requests-all", recordController.getAllRequest)
    .post("/requests-filter", recordController.recordRequestFilter);

module.exports = router;