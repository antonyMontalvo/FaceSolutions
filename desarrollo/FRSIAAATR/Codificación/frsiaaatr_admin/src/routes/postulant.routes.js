const router = require("express").Router();

const postulantController = require("../controllers/postulant.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate");

router
    .get("/list", postulantController.listPostulant)
    .get("/info", postulantController.getDetailPostulant)
    .get("/info_request", postulantController.getInfoRequest)
    .get("/info_requestProcess", postulantController.getInfoRequestProcess)
    .get("/request_list", postulantController.getrequestList)
    .get("/request_listProcess", postulantController.getrequestListProcess)
    .get("/review_requirement", postulantController.reviewRequirement)
;

module.exports = router;
