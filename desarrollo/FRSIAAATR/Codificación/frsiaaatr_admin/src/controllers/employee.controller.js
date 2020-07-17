const bcrypt = require("bcryptjs");

const Employee = require("../models/employee"), //pongo Employee porque es un modelo
    { createToken, getPayload } = require("../services/jwt"),
    EmployeesController = {},
    saltRounds = 10;

EmployeesController.getEmployees = async(req, res) => {
    try {
        // const employees = await Employee.findAll();
        // console.log(employees);
        // if (!employees)
        //   return res.status(404).json({
        //     message: "Not records found",
        //   });
        // else res.status(200).json({ data: employees });
        res.render("employee/index");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

EmployeesController.getInfoRequest = async(req, res) => {
    try {
        res.render("employee/infoRequest");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

EmployeesController.getrequestList = async(req, res) => {
    try {
        res.render("employee/requestList");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

EmployeesController.getInfoAplicant = async(req, res) => {
    try {
        res.render("employee/infoAplicant");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

module.exports = EmployeesController;
