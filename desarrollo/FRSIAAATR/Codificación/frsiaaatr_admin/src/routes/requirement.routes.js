const router = require("express").Router();

const requirementController = require("../controllers/requirement.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate");

router
    .get("/all-postulant", requirementController.getPostulantList)
    .get("/postulant-review", requirementController.getReviewInfo);

module.exports = router;