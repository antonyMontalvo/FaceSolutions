const router = require("express").Router();

const postulantController = require("../controllers/postulant.controller"),
    validator = require("../middlewares/validation"),
    UploadImage = require('../services/files'),
    {checkToken} = require("../middlewares/auth");

router
    .get("/", checkToken, postulantController.getIndex)
    .get("/login", postulantController.loginView)
    .get("/register", postulantController.registerView)
    .post("/login", postulantController.login)
    .post("/register", UploadImage.userPhoto, postulantController.register)
    .get("/registreFotos", postulantController.getRegistrePhoto)
    .post("/registreFotos", (req, res) => {
        console.log("xd", req);
        console.log("xd", req.body);
        return res.status(200).json({error: ''});
    })
    .get("/facial", postulantController.prueba)

module.exports = router;
