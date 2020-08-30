const router = require("express").Router();

const constancyDerivedController = require("../controllers/constancyDeridev.controller"),
  validator = require("../middlewares/validation"),
  authenticate = require("../middlewares/authenticate");

router
  //.get("/generate-constancy", constancyDerivedController)
  .get("/request-in-derived", constancyDerivedController.cargarVistaParaFirma)
  .get(
    "/request-in-derived-list",
    constancyDerivedController.llenarTablaSolicitudesParaFirmar
  )
  .post("/filtrarSolicitudes", constancyDerivedController.filtrar)
  .get(
    "/redireccionarVistaFirmaContancia/:id",
    constancyDerivedController.getProcess
  )
  .get("/firmarConstancia/:dni", constancyDerivedController.firmaConstancia)
  .post("/enviarConstancia", constancyDerivedController.enviar);
module.exports = router;
