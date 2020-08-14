const router = require("express").Router();

const recordController = require("../controllers/record.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate");

router
    .get("/requests-record", recordController.getRequestsRecords);

module.exports = router;