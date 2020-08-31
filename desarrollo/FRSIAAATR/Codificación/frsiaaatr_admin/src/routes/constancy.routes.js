const router = require("express").Router();

const constancyController = require("../controllers/constancy.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate"),
    { checkToken } = require("../middlewares/auth");

router
    .get("/request-unread", checkToken, constancyController.getRequestUnreadList)
    .get("/review-request/:id", checkToken, constancyController.getReviewUnreadInfo)
    //Revisar todas las solicitudes
    .get("/all-review-request/:id", constancyController.getAllReviewRequest)
    .get("/postulant-info-request/:id", constancyController.getPostulantRequestInfo)
    //Actualizar estado de requisito (y el de la solicitud según estados req)
    .put("/update-req-state", constancyController.updateRequirementState)
    //Actaulizar estado de solicitud (general)
    .put("/update-state", constancyController.updateRequestState)
    .get("/all-process", constancyController.getAllProcess)
    .post("/filter-process", constancyController.filterProcess);

module.exports = router;