const router = require("express").Router();

const employeeController = require("../controllers/employee.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate"),
    { checkToken } = require("../middlewares/auth");

router
    .get("/index", /*checkToken,*/ employeeController.getEmployees)
    .get("/process", /*checkToken,*/ employeeController.getAllProcess);
module.exports = router;