
// *************************************************************************
const router = require("express").Router();

const postulantController = require("../controllers/postulant.controller"),
validator = require("../middlewares/validation"),
{ checkToken } = require("../middlewares/auth");

router.get("/login", postulantController.login);
router.get("/home", postulantController.home);

router.get("/registro", postulantController.registro);
router.post("/registro",  postulantController.registrando);
module.exports = router;
