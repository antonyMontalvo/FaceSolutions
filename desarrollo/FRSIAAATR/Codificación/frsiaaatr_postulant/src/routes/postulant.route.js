const router = require("express").Router();

const postulantController = require("../controllers/postulant.controller"),
    validator = require("../middlewares/validation"),
    { checkToken } = require("../middlewares/auth");

router
    .get("/login", postulantController.login);


router.get("/facial", (req, res) => {
  res.render("prueba",{layout:"login"});
});

router.post("/api",(req, res) => {
  console.log("Ingreso éxitoso");
});
module.exports = router;
