const bcrypt = require("bcryptjs");

const Employee = require("../models/department"), //pongo Employee porque es un modelo
    { createToken, getPayload } = require("../services/jwt"),
    AdminController = {},
    saltRounds = 10;

const { QueryTypes } = require('sequelize');
const { sequelizeDB } = require("../../config/database");

AdminController.getIndex = async(req, res) => {
    try {
        res.render("admin/profile", {
            layout: "main",
            data: { admin: req.session.usuario[0] }
        });
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

AdminController.loginAdmin = async(req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const q = `SELECT a.id, 
            a.name as nombre,  
            a.last_name_1 as apellidoPaterno,  
            a.last_name_2 as apellidoMaterno,  
            concat_ws(' ', a.name, a.last_name_1, a.last_name_2 ) as nombreCompleto,  
            a.dni as dni,  
            a.birthdate as fechaNacimiento,  
            a.email as email,  
            a.firm_path as rutaFirma  
        FROM administrator a WHERE a.email = '` + email + `' AND a.password = '` + password + `'`;

        var result = await sequelizeDB.query(q);
        var adminFound = result[0];

        if (adminFound) {
            req.session.usuario = adminFound;
            req.session.token = createToken(adminFound);
        }

        return res.send(req.session.usuario);

    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
}

AdminController.logout = async(req, res) => {
    try {
        req.session.usuario = null;
        req.session.token = null;
        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};

module.exports = AdminController;