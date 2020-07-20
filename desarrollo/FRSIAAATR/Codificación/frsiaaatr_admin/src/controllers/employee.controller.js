const bcrypt = require("bcryptjs");

const Department = require("../models/department"), //pongo Employee porque es un modelo
    {createToken, getPayload} = require("../services/jwt"),
    EmployeesController = {},
    saltRounds = 10;

EmployeesController.getEmployees = async (req, res) => {
    try {
        const employees = await Department.findAll();
        console.log(employees);

        res.render("employee/index", {title: 'dddd'});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

module.exports = EmployeesController;
