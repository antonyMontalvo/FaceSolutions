const router = require("express").Router();

const postulantController = require("../controllers/postulant.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate");

router
    .get("/all-postulant", postulantController.getPostulantList)
    .get("/postulant-review/:id", postulantController.getReviewInfo)
    .get("/basic-information", postulantController.getDetailPostulant)

//Endpoints requisitos
.get("/get-postulants", postulantController.getAllPostulant)
    .get("/get-one-postulant/:id", postulantController.getPostulantInfo)
    .get("/get-all-requirement/:id", postulantController.getAllRequirement)
    .put("/update-req-postulant", postulantController.updateRequirementPostulant);

module.exports = router;