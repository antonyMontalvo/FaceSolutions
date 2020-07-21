const router = require("express").Router();

const employeeController = require("../controllers/employee.controller"),
  validator = require("../middlewares/validation"),
  authenticate = require("../middlewares/authenticate");

router
    .get("/index", employeeController.getEmployees)
    ;

module.exports = router;
