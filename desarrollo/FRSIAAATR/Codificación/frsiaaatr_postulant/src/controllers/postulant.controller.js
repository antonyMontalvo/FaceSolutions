const bcrypt = require("bcryptjs");
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
