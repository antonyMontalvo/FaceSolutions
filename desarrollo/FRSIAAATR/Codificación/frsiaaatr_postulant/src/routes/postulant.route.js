const router = require("express").Router();

const postulantController = require("../controllers/postulant.controller"),
validator = require("../middlewares/validation"),
{ checkToken } = require("../middlewares/auth");

router.get("/login", postulantController.login);
router.get("/home", postulantController.home);



module.exports = router;
