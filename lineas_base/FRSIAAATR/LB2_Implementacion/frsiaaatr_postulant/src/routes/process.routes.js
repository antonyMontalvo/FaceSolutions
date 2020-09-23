const router = require("express").Router();

const processController = require("../controllers/process.controller"),
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
    .get("/TramitesNuevos", checkToken, processController.newRequirements)
    .get("/TramitesCorreccion", checkToken, processController.correccion)
    .get("/TramitesCorreccion/editar/:id", checkToken, processController.correccionDocumento)
    .get("/TramitesRechazados", checkToken, processController.rechazados)

    .post("/create", checkToken, processController.create)
    .post("/update_requirements", upload.array("files", 10), processController.updateRequirement)

module.exports = router;
