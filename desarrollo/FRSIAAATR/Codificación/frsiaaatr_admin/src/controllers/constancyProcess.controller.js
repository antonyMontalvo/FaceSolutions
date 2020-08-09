const bcrypt = require("bcryptjs");
"use strict";

const { QueryTypes } = require('sequelize');
const { sequelizeDB } = require("../../config/database");

const Employee = require("../models/department"),
    { createToken, getPayload } = require("../services/jwt"),
    ConstancyProcessController = {};

//Información de solicitud en proceso
ConstancyProcessController.getReviewInProcessInfo = async(req, res) => {
    try {
        res.render("constancy/generateConstancy");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Lista de solicitudes En Proceso
ConstancyProcessController.getRequestInProcessList = async(req, res) => {
    try {
        res.render("constancy/requestInProcess");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

module.exports = ConstancyProcessController;