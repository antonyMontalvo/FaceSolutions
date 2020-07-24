const bcrypt = require("bcryptjs");

const Employee = require("../models/department"), //pongo Employee porque es un modelo
    {createToken, getPayload} = require("../services/jwt"),
    PostulantController = {},
    saltRounds = 10;

PostulantController.listPostulant = async (req, res) => {
    try {
        res.render("postulant/listPostulant");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

PostulantController.getDetailPostulant = async (req, res) => {
    try {
        res.render("postulant/infoAplicant");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

PostulantController.getInfoRequest = async(req, res) => {
    try {
        res.render("postulant/infoRequest");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

PostulantController.getInfoRequestProcess = async(req, res) => {
    try {
        res.render("postulant/infoRequestProcess");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

PostulantController.getrequestList = async(req, res) => {
    try {
        res.render("postulant/requestList");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};


PostulantController.getrequestListProcess = async(req, res) => {
    try {
        res.render("postulant/requestListProcess");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};



PostulantController.reviewRequirement = async(req, res) => {
    try {
        res.render("postulant/reviewRequirement");
        //response.send("uno, dos, tres..");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

module.exports = PostulantController;
