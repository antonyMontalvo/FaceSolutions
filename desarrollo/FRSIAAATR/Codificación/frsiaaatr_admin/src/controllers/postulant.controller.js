const bcrypt = require("bcryptjs");

const Employee = require("../models/department"), //pongo Employee porque es un modelo
    { createToken, getPayload } = require("../services/jwt"),
    PostulantController = {},
    saltRounds = 10;

//Información básica del postulante
PostulantController.getDetailPostulant = async(req, res) => {
    try {
        res.render("postulant/basicInformation");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

module.exports = PostulantController;