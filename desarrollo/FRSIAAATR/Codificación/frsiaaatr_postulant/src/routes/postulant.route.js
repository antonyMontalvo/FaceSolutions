const router = require("express").Router();

const postulantController = require("../controllers/postulant.controller"),
    validator = require("../middlewares/validation"),
    UploadImage = require('../services/files'),
    { checkToken } = require("../middlewares/auth");

router
    .get("/", checkToken, postulantController.index)
    .get("/login", postulantController.loginView)
    .get("/register", postulantController.registerView)
    .post("/login", postulantController.login)
    .post("/register", UploadImage.userPhoto, postulantController.register)
;

module.exports = router;
