const router = require("express").Router();

const constancyDerivedController = require("../controllers/constancyDeridev.controller"),
  validator = require("../middlewares/validation"),
  authenticate = require("../middlewares/authenticate");

  router
  //.get("/generate-constancy", constancyDerivedController)
  .get("/request-in-derived", constancyDerivedController.cargarVistaParaFirma);

module.exports = router;