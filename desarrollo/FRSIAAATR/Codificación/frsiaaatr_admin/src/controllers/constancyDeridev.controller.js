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
ConstancyDerivedController.getProcess = async (req, res) => {
  const path = require("path");
  const puppeteer = require("puppeteer");
  const handlebars = require("handlebars");
  var fs = require("fs");
  var express = require("express");
  var hbs = require("express-handlebars");

  var app = express();

  app.engine("hbs", hbs({ extname: "hbs" }));
  app.set("view engine", "hbs");
  app.use(express.static(path.join(__dirname, "public")));

  var hoy = new Date();
  var dd = hoy.getDate();
  var mm = hoy.getMonth() + 1;
  var yyyy = hoy.getFullYear();

  var fecha_actual = dd + "/" + mm + "/" + yyyy;

  //Codigo de la solicitud
  const id = req.params.id;
  let q =
    `select 
	concat_ws(' ', ps.name, ps.last_name_1, ps.last_name_2) as solicitante,
    ps.dni as dni,
    f.name as facultad,
    sp.name as especialidad,
	p.code as numero_expediente,
    p.date_created as fecha_expediente_completa,
    cast(p.date_created as date) as fecha_expediente,
    EXTRACT(YEAR FROM p.date_created) as año,
    SUBSTR(p.code,3) as numero_emision,
    pt.state_name as estado_expediente,
    concat_ws(' ', ad.name, ad.last_name_1, ad.last_name_2) as encargado_expediente,
    p.document as documento
    from postulant ps 
    left join specialty sp on sp.id = ps.specialty_id
    left join faculty f on sp.faculty_id = f.id
    left join process p on p.postulant_id = ps.id
    left join process_state pt on p.state_process = pt.idprocess_state
    left join administrator ad on p.administrator_id = ad.id
    where p.code = ` + id;
  console.log(q);
  const process = await sequelizeDB.query(q);
  //res.send(process[0]);
  try {
    var solicitante = process[0][0]["solicitante"];
    var dni = process[0][0]["dni"];
    var facultad = process[0][0]["facultad"];
    var especialidad = process[0][0]["especialidad"];
    var numero_expediente = process[0][0]["numero_expediente"];
    var fecha_expediente_completa = process[0][0]["fecha_expediente_completa"];
    var anio = process[0][0]["año"];
    var numero_emision = process[0][0]["numero_emision"];
    var estado_expediente = process[0][0]["estado_expediente"];
    var encargado_expediente = process[0][0]["encargado_expediente"];

    res.render("constancy/finishConstancy", {
      solicitante: solicitante,
      dni: dni,
      facultad: facultad,
      especialidad: especialidad,
      numero_expediente: numero_expediente,
      fecha_expediente_completa: fecha_expediente_completa,
      anio: anio,
      numero_emision: numero_emision,
      estado_expediente: estado_expediente,
      encargado_expediente: encargado_expediente,
      fecha_actual: fecha_actual,
      succesfull: "",
    });
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ error: error.stack });
  }
};

ConstancyDerivedController.cargarVistaParaFirma = async (req, res) => {
    console.log("LLegue aqui");
    try {
        res.render("constancy/requestInFinish");
      } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
      }
  };

  ConstancyDerivedController.llenarTablaSolicitudesParaFirmar = async (req, res) => {
    try {
      const q = `SELECT 
      p.code as codigoSolicitud,
      p.state_process as estadoSolicitud,		pst.state_name as nombreEstadoSolicitud,  p.date_created as fechaSolicitud,
      c.name as nombreConstancia,
      ps.name as nombre, ps.last_name_1 as apellidoPaterno, 
      ps.last_name_2 as apellidoMaterno,concat_ws(' ', ps.name, ps.last_name_1, ps.last_name_2) as nombreCompleto,  
      ps.postulant_code as codigoPostulante,ps.dni as numeroDocumento,
      sp.name as escuelaAcademica,sp.initials as escuelaIniciales,
      f.name as facultad,f.initials as facultadIniciales
      FROM process p LEFT JOIN postulant ps 
      ON p.postulant_id = ps.id 
      LEFT JOIN constancy c ON p.constancy_id = c.id
      LEFT JOIN specialty sp ON ps.specialty_id = sp.id
      LEFT JOIN faculty f ON sp.faculty_id = f.id
      LEFT JOIN process_state pst
          ON p.state_process = pst.idprocess_state
          where p.state_process = 8`;
  
      const process = await sequelizeDB.query(q);
      res.send(process[0]);
    } catch (error) {
      console.log(error.stack);
      return res.status(500).json({ error: error.stack });
    }
  };

  ConstancyDerivedController.filtrar = async (req, res) => {
    const name = req.body.name;
    const lastnamePatern = req.body.lastnamePatern;
    const lastnameMatern = req.body.lastnameMatern;
    const dni = req.body.dni;
    const number_doc = req.body.number_doc;
    const date = req.body.date;
    const id_faculty = req.body.id_faculty;
    const id_specialty = req.body.id_specialty;
  
    let q = `SELECT 
      p.code as codigoSolicitud,
      p.state_process as estadoSolicitud,
      pst.state_name as nombreEstadoSolicitud,  
      p.date_created as fechaSolicitud,
      c.name as nombreConstancia,
      ps.name as nombre, 
      ps.last_name_1 as apellidoPaterno,  
      ps.last_name_2 as apellidoMaterno,
      concat_ws(' ', ps.name, ps.last_name_1, ps.last_name_2) as nombreCompleto,  
      ps.postulant_code as codigoPostulante,
      ps.dni as numeroDocumento,
      sp.name as escuelaAcademica,
      sp.initials as escuelaIniciales,
      f.name as facultad,
      f.initials as facultadIniciales
      FROM 
      process p LEFT JOIN postulant ps 
      ON p.postulant_id = ps.id 
      LEFT JOIN constancy c 
      ON p.constancy_id = c.id
      LEFT JOIN specialty sp
      ON ps.specialty_id = sp.id
      LEFT JOIN faculty f
      ON sp.faculty_id = f.id
      LEFT JOIN process_state pst
      ON p.state_process = pst.idprocess_state where p.state_process = '8' `;
  
    if (name != null && name != "null") {
      q = q + ` and ps.name = ` + "'" + name + "'";
    }
    if (lastnamePatern != null) {
      q = q + ` and ps.last_name_1 = ` + "'" + lastnamePatern + "'";
    }
    if (lastnameMatern != null) {
      q = q + ` and ps.last_name_2 = ` + "'" + lastnameMatern + "'";
    }
    if (dni != null) {
      q = q + ` and ps.dni = ` + "'" + dni + "'";
    }
    if (number_doc != null) {
      q = q + ` and p.code = ` + "'" + number_doc + "'";
    }
    if (id_faculty != null) {
      q = q + ` and f.id = ` + "'" + id_faculty + "'";
    }
    if (id_specialty != null) {
      q = q + ` and sp.id = ` + "'" + id_specialty + "'";
    }
    console.log(q);
    const process = await sequelizeDB.query(q);
    res.send(process[0]);
  };

  module.exports = ConstancyDerivedController;