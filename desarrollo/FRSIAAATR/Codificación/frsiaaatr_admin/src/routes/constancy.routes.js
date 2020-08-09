const router = require("express").Router();

const constancyController = require("../controllers/constancy.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate");

router
    .get("/review-request", constancyController.getReviewUnreadInfo)
    .get("/generate-constancy", constancyController.getReviewInProcessInfo)
    .get("/request-unread", constancyController.getRequestUnreadList)
    .get("/request-in-process", constancyController.getRequestInProcessList)
    .get("/all-process", constancyController.getAllProcess)
    .post("/filter-process", constancyController.filterProcess);

module.exports = router;