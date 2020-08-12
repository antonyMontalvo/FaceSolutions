const bcrypt = require("bcryptjs");
<<<<<<< HEAD
const Department = require("../models/department"), //pongo Employee porque es un modelo
  { createToken, getPayload } = require("../services/jwt"),
  PostulantController = {},
  saltRounds = 10;
PostulantController.getIndex = async (req, res) => {
  try {
    res.render("postulant/index");
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ error: error.stack });
  }
};

PostulantController.getLogin = async (req, res) => {
  try {
    res.render("login", { layout: null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: error.stack });
  }
};

PostulantController.getRegistre = async (req, res) => {
  try {
    res.render("registro", { layout: null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: error.stack });
  }
};

PostulantController.getRegistrePhoto = async (req, res) => {
  try {
    res.render("registroFotos", { layout: null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: error.stack });
  }
};

module.exports = PostulantController;
=======

const Postulant = require("../models/postulant"),
    {createToken, getPayload} = require("../services/jwt"),
    EmployeesController = {},
    saltRounds = 10;

EmployeesController.login = async (req, res) => {
    try {
        const postulants = await Postulant.findAll();
        console.log(postulants);

        res.render("login", {layout: null});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

module.exports = EmployeesController;
>>>>>>> 8e29c51194a8209341e1129bea6fa0951c6c2147
