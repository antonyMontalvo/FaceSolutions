const bcrypt = require("bcryptjs");
"use strict";

const { QueryTypes } = require('sequelize');
const { sequelizeDB } = require("../../config/database");

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

//Lista de solicitudes No Leídas
ConstancyController.getRequestUnreadList = async(req, res) => {
    try {
        res.render("constancy/requestUnread");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Todas las solicitudes
ConstancyController.getAllProcess = async(req, res) => {
    try {

        const q = `SELECT 
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
		ON p.state_process = pst.idprocess_state`;

        const process = await sequelizeDB.query(q);
        res.send(process[0]);

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Filtro de solicitudes no leídas
ConstancyController.filterProcess = async(req, res) => {

    const name = req.body.name;
    const lastNamePatern = req.body.lastNamePatern;
    const lastNameMatern = req.body.lastNameMatern;
    const dni = req.body.dni;
    const numberDoc = req.body.numberDoc;
    const date = req.body.date;
    const idFaculty = req.body.idFaculty;
    const idSpecialty = req.body.idSpecialty;
    const idProcessState = req.body.idProcessState;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

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
    ON p.state_process = pst.idprocess_state where p.code != 'null' `;

    if (name != null && name != 'null') {
        q = q + ` and ps.name = ` + "'" + name + "'";
    }
    if (lastNamePatern != null) {
        q = q + ` and ps.last_name_1 = ` + "'" + lastNamePatern + "'";
    }
    if (lastNameMatern != null) {
        q = q + ` and ps.last_name_2 = ` + "'" + lastNameMatern + "'";
    }
    if (dni != null) {
        q = q + ` and ps.dni = ` + "'" + dni + "'";
    }
    if (numberDoc != null) {
        q = q + ` and p.code = ` + "'" + numberDoc + "'";
    }
    if (idFaculty != null) {
        q = q + ` and f.id = ` + "'" + idFaculty + "'";
    }
    if (idSpecialty != null) {
        q = q + ` and sp.id = ` + "'" + idSpecialty + "'";
    }
    if (idProcessState != null) {
        q = q + ` and p.state_process = ` + "'" + idProcessState + "'";
    }
    if (startDate != null && endDate != null) {
        q = q + ` and p.date_created between ` + "'" + startDate + "' and " + "'" + endDate + "'";
    }
    console.log(q);
    const process = await sequelizeDB.query(q);
    res.send(process[0]);
}

//Información de solicitud en proceso
ConstancyController.getReviewInProcessInfo = async(req, res) => {
    try {
        res.render("constancy/generateConstancy");
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