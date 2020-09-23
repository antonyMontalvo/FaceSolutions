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
    //views
    .get("/", checkToken, postulantController.profile)
    .get("/login", postulantController.loginView)
    .get("/register", postulantController.registerView)
    .get("/profile", checkToken, postulantController.profile)
    .get("/message", checkToken, postulantController.message)
    .get("/information", checkToken, postulantController.information)
    // .get("/TramitesCorreccion", checkToken, postulantController.correccion)
    // .get("/TramitesCorreccion/editar", checkToken, postulantController.correccionDocumento)
    // .get("/TramitesRechazados", checkToken, postulantController.rechazados)

    .post("/login", postulantController.login)
    .post("/logout", postulantController.logout)
    .post("/login_camera", postulantController.loginCamera)
    .post("/register", postulantController.register)
    .get("/registreFotos", postulantController.getRegistrePhoto)
    .post("/registreFotos", upload.array("images", 20), postulantController.registerPhotos)
    .post("/check_image", UploadImage.userPhoto, postulantController.checkPhoto)
    .post("/update_photo", UploadImage.userPhoto, postulantController.updatePhoto)


    // .get("/facial", postulantController.prueba)
module.exports = router;
