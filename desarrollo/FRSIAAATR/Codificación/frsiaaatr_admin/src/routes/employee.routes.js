const router = require("express").Router();

const employeeController = require("../controllers/employee.controller"),
  validator = require("../middlewares/validation"),
  authenticate = require("../middlewares/authenticate"),
{ checkToken } = require("../middlewares/auth");

router
    .get("/index", checkToken, employeeController.getEmployees)
    ;

module.exports = router;
