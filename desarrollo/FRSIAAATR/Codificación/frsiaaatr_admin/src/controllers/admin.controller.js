const bcrypt = require("bcryptjs");

const Employee = require("../models/department"), //pongo Employee porque es un modelo
    {createToken, getPayload} = require("../services/jwt"),
    AdminController = {},
    saltRounds = 10;

AdminController.getIndex = async (req, res) => {
    try {
        res.render("admin/index");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

AdminController.getLogin = async (req, res) => {
    try {
        res.render("login", {layout: null});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

AdminController.getRegister = async (req, res) => {
    try {
        res.render("registro", {layout: null});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

module.exports = AdminController;
