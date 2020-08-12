const bcrypt = require("bcryptjs");

const Employee = require("../models/department"), //pongo Employee porque es un modelo
    { createToken, getPayload } = require("../services/jwt"),
    AdminController = {},
    saltRounds = 10;

const { QueryTypes } = require('sequelize');
const { sequelizeDB } = require("../../config/database");

AdminController.getIndex = async(req, res) => {
    try {
        res.render("admin/profile");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

AdminController.getLogin = async(req, res) => {
    try {
        res.render("login", { layout: null });
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

AdminController.getRegister = async(req, res) => {
    try {
        res.render("registro", { layout: null });
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

AdminController.getDataFilter = async(req, res) => {
    try {
        const faculty_id = req.body.faculty_id;
        const specialties = await sequelizeDB.query('select * from specialty where faculty_id = ?', {
            replacements: [faculty_id],
            type: QueryTypes.SELECT
        });
        console.log(specialties);

        const faculties = await sequelizeDB.query('select * from faculty');
        console.log(faculties);

        res.render("postulant/requestList", { specialties: specialties, faculties: faculties });

    } catch (error) {

        console.log(error.stack);
        return res.status(500).json({ error: error.stack });

    }
}

module.exports = AdminController;