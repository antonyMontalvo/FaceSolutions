const bcrypt = require("bcryptjs");

const Employee = require("../models/department"), //pongo Employee porque es un modelo
    { createToken, getPayload } = require("../services/jwt"),
    RequirementController = {},
    saltRounds = 10;

//Requerimientos de POSTULANTE

//Lista de postulantes
RequirementController.getPostulantList = async(req, res) => {
    try {
        res.render("postulantRequirement/postulantList");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Revisar información de postulante (nombres, documento, fotos, etc...)
RequirementController.getReviewInfo = async(req, res) => {
    try {
        res.render("postulantRequirement/reviewRequirement");
        //response.send("uno, dos, tres..");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

module.exports = RequirementController;