const router = require("express").Router();

const postulantController = require("../controllers/postulant.controller"),
  validator = require("../middlewares/validation"),
  authenticate = require("../middlewares/authenticate");

router.get("/basic-information", postulantController.getDetailPostulant);

module.exports = router;
