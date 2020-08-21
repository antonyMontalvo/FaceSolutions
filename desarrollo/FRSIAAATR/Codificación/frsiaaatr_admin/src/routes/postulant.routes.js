const router = require("express").Router();

const postulantController = require("../controllers/postulant.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate");

router
    .get("/all-postulant", postulantController.getPostulantList)
    .get("/postulant-review", postulantController.getReviewInfo)
    .get("/basic-information", postulantController.getDetailPostulant)

//Endpoints requisitos
.get("/get-postulants", postulantController.getAllPostulant)
    .get("/get-one-postulant", postulantController.getPostulantInfo)
    .get("/get-all-requirement", postulantController.getAllRequirement)
    .post("/update-req-postulant", postulantController.updateRequirementPostulant);

module.exports = router;