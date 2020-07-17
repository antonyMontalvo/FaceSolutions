const router = require("express").Router();

const employeeController = require("../controllers/employee.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate");

router
    .get("/", employeeController.getEmployees)
    .get("/infoRequest", employeeController.getInfoRequest);

module.exports = router;