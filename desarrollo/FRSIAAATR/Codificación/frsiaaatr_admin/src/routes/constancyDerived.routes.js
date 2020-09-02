const router = require("express").Router();

const constancyDerivedController = require("../controllers/constancyDeridev.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate"),
    { checkToken } = require("../middlewares/auth");

router
//.get("/generate-constancy", constancyDerivedController)
    .get("/request-in-derived", checkToken, constancyDerivedController.cargarVistaParaFirma)
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