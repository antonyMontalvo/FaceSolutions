const bcrypt = require("bcryptjs");

const Employee = require("../models/department"), //pongo Employee porque es un modelo
    { createToken, getPayload } = require("../services/jwt"),
    RecordController = {},
    saltRounds = 10;

//Información básica del postulante
RecordController.getRequestsRecords = async(req, res) => {
    try {
        res.render("records/requestsRecords");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

module.exports = RecordController;