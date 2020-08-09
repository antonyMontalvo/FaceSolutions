const router = require("express").Router();

const constancyController = require("../controllers/constancy.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate");

router
    .get("/request-unread", constancyController.getRequestUnreadList)
    .get("/review-request/:id", constancyController.getReviewUnreadInfo)
    .get("/all-review-request/:id", constancyController.getAllReviewRequest) //Revisar todas las solicitudes
    .get("/postulant-info-request/:id", constancyController.getPostulantRequestInfo)
    /* .get("/request-in-derived", constancyController.getRequestInDerivedList)
    .get("/derived-constancy", constancyController.getRequestInDerivedConstancy) */
    .get("/all-process", constancyController.getAllProcess)
    .post("/filter-process", constancyController.filterProcess);
module.exports = router;