const bcrypt = require("bcryptjs");

const Postulant = require("../models/postulant"),
    Department = require("../models/department"),
    Province = require("../models/province"),
    District = require("../models/district"),
    {createToken, getPayload} = require("../services/jwt"),
    EmployeesController = {},
    saltRounds = 10;

// Views

EmployeesController.index = async (req, res) => {
    try {
        res.render("index");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

EmployeesController.loginView = async (req, res) => {
    try {
        res.render("login", {layout: null});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

EmployeesController.registerView = async (req, res) => {
    try {
        const departments = await Department.findAll();
        const provinces = await Province.findAll();
        const districts = await District.findAll();

        res.render("registro", {layout: null, data: {departments, provinces, districts}});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

// Logic

EmployeesController.login = async (req, res) => {
    try {
        const {dni} = req.body;
        const postulantFound = await Postulant.findOne({
                where: {
                    dni
                }
            }
        );

        if (postulantFound) {
            req.session.usuario = postulantFound.name;
            req.session.token = createToken(postulantFound);
        }

        res.redirect("/");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

EmployeesController.register = async (req, res) => {
    try {
        const body = req.body;
        const postulant = await Postulant.create();

        if (postulant)
            res.render("registro", {layout: null, data: {}, message: {}});
        else

            res.redirect("/");

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

module.exports = EmployeesController;
