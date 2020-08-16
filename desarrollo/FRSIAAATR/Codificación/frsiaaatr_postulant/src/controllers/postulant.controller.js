const bcrypt = require("bcryptjs");

const Postulant = require("../models/postulant"),
  { createToken, getPayload } = require("../services/jwt"),
  EmployeesController = {},
  saltRounds = 10;

EmployeesController.login = async (req, res) => {
  try {
    const postulants = await Postulant.findAll();
    console.log(postulants);

    res.render("login", { layout: null });
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ error: error.stack });
  }
};

module.exports = EmployeesController;
