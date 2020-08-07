const bcrypt = require("bcryptjs");

const Postulant = require("../models/postulant"),
    Department = require("../models/department"),
    Province = require("../models/province"),
    District = require("../models/district"),
    {createToken, getPayload} = require("../services/jwt"),
    PostulantController = {},
    saltRounds = 10;

// Views
PostulantController.getIndex = async (req, res) => {
    try {
        res.render("postulant/index");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

PostulantController.loginView = async (req, res) => {
    try {
        res.render("login", {layout: null});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

PostulantController.registerView = async (req, res) => {
    try {
        const departments = await Department.findAll({raw: true});
        const provinces = await Province.findAll({raw: true});
        const districts = await District.findAll({raw: true});

        res.render("registro", {layout: null, data: {departments, provinces, districts}});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};
PostulantController.prueba = async (req, res) => {
    res.render("prueba", {layout: "postulantelogin"});
}

// Logic
PostulantController.login = async (req, res) => {
    try {
        const {dni, postulant_code} = req.body;
        const postulantFound = await Postulant.findOne({
                where: {dni, postulant_code}
            }
        );

        if (postulantFound) {
            const code = String("_" + dni + "_" + postulant_code);
            res.render("prueba", {layout: "postulantelogin", data: {code}});
        } else
            res.render("login", {layout: null});

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

PostulantController.loginCamera = async (req, res) => {
    try {
        const {dni, postulant_code, state} = req.body;
        const postulantFound = await Postulant.findOne({
                where: {dni, postulant_code}
            }
        );

        if (postulantFound && state) {
            req.session.usuario = postulantFound.name;
            req.session.token = createToken(postulantFound);
            res.render("prueba", {layout: "postulantelogin", data: {}});
        } else {
            res.redirect("/");
        }

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

PostulantController.register = async (req, res) => {
    try {
        const body = req.body;
        const postulant = await Postulant.create();

        let message = null;
        if (!postulant)
            message = postulant;

        console.log(postulant)
        res.redirect("/", {layout: null, data: {}, message});

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

PostulantController.getRegistrePhoto = async (req, res) => {
    try {
        res.render("registroFotos", {layout: null});
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: error.stack});
    }
};

module.exports = PostulantController;
