const router = require("express").Router();

const constancyController = require("../controllers/constancy.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate");

router
    .get("/review-request", constancyController.getReviewUnreadInfo)
    .get("/generate-constancy", constancyController.getReviewInProcessInfo)
    .get("/request-unread", constancyController.getRequestUnreadList)
    .get("/request-in-process", constancyController.getRequestInProcessList)
    .get("/request-in-derived", constancyController.getRequestInDerivedList)
    .get("/derived-constancy", constancyController.getRequestInDerivedConstancy)
    .post("/filterProcess", constancyController.filterProcess);

module.exports = router;