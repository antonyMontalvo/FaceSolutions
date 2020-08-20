const bcrypt = require("bcryptjs");
("use strict");

const { QueryTypes } = require("sequelize");
const { sequelizeDB } = require("../../config/database");
const ConstancyController = require("./constancy.controller");

const Employee = require("../models/department"),
  { createToken, getPayload } = require("../services/jwt"),
  ConstancyDerivedController = {};

//Crear un metodo
/* updated process set document_category = + tipo_documento +  and document_description = + asunto 
   where code = + numero_expediente;

*/

ConstancyDerivedController.cargarVistaParaFirma = async (req, res) => {
    console.log("LLegue aqui");
    try {
        res.render("constancy/requestInFinish");
      } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
      }
  };


  module.exports = ConstancyDerivedController;