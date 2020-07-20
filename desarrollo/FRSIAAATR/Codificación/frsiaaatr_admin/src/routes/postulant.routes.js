const router = require("express").Router();

const postulantController = require("../controllers/postulant.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate");

router
    .get("/list", postulantController.listPostulant)
    .get("/info", postulantController.getDetailPostulant)
    .get("/info_request", postulantController.getInfoRequest)
    .get("/request_list", postulantController.getrequestList)
    .get("/review_requirement", postulantController.reviewRequirement)
;

module.exports = router;
