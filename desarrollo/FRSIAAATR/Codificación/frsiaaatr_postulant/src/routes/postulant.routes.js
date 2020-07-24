const router = require("express").Router();

const postulantController = require("../controllers/postulant.controller"),
  validator = require("../middlewares/validation"),
  authenticate = require("../middlewares/authenticate");

router.get("/", postulantController.getIndex);
router.get("/login", postulantController.getLogin);
router.get("/registre", postulantController.getRegistre);
router.get("/registreFotos", postulantController.getRegistrePhoto);
router.post("/registreFotos", (req, res) => {
  console.log("xd", req.body);
});

module.exports = router;
