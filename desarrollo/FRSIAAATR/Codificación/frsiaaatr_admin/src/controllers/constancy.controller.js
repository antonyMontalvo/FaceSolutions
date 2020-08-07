const bcrypt = require("bcryptjs");

const Employee = require("../models/department"),
    { createToken, getPayload } = require("../services/jwt"),
    ConstancyController = {},
    saltRounds = 10;

//Información de solicitud no leída
ConstancyController.getReviewUnreadInfo = async(req, res) => {
    try {
        res.render("constancy/reviewRequest");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Información de solicitud en proceso
ConstancyController.getReviewInProcessInfo = async(req, res) => {
    try {
        res.render("constancy/generateConstancy");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Lista de solicitudes No Leídas
ConstancyController.getRequestUnreadList = async(req, res) => {
    try {
        res.render("constancy/requestUnread");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Lista de solicitudes En Proceso
ConstancyController.getRequestInProcessList = async(req, res) => {
    try {
        res.render("constancy/requestInProcess");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

module.exports = ConstancyController;