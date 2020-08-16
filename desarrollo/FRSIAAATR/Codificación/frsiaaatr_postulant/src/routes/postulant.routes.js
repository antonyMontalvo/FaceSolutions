const router = require("express").Router();

const postulantController = require("../controllers/postulant.controller"),
    validator = require("../middlewares/validation"),
    UploadImage = require('../services/files'),
    {checkToken} = require("../middlewares/auth");

const path = require('path')

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname + "/../public/moment"))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

const upload = multer({storage: storage})

router
    .get("/", checkToken, postulantController.getIndex)
    .get("/login", postulantController.loginView)
    .get("/register", postulantController.registerView)
    .post("/login", postulantController.login)
    .post("/register", postulantController.register)
    .get("/registreFotos", postulantController.getRegistrePhoto)
    .post("/registreFotos", upload.array("images", 20), postulantController.registerPhotos)
    .post("/check_image", UploadImage.userPhoto, postulantController.checkPhoto)
    .get("/facial", postulantController.prueba)

    .get("/profile", postulantController.profile)

    .get("/TramitesCorreccion", postulantController.correccion)
    .get("/TramitesRechazados", postulantController.rechazados)

module.exports = router;
