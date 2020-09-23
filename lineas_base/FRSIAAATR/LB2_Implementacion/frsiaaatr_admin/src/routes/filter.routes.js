const router = require("express").Router();

const filterController = require("../controllers/filter.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate"),
    { checkToken } = require("../middlewares/auth");

router
    .get("/getSpecialties", filterController.getAllSpecialties)
    .get("/getSpecialties/:id", filterController.getSpecialties)
    .get("/getFaculties", filterController.getAllFaculties)
    .get("/getFaculties/:id", filterController.getFaculties)
    .get("/getProcessState", filterController.getProcessState);
module.exports = router;