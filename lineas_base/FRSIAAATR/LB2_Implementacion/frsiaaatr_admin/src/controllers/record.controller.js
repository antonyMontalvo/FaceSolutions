const bcrypt = require("bcryptjs");
"use strict";

const { QueryTypes } = require('sequelize');
const { sequelizeDB } = require("../../config/database");

const Employee = require("../models/department"), //pongo Employee porque es un modelo
    { createToken, getPayload } = require("../services/jwt"),
    RecordController = {},
    saltRounds = 10;

//Historial de solicitudes
RecordController.getRequestsRecords = async(req, res) => {
    try {
        res.render("records/requestsRecords");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

RecordController.getAllRequest = async(req, res) => { //Finalizadas y Rechazadas
    try {
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
        ON p.state_process = pst.idprocess_state
        WHERE p.state_process IN (5,8)`; // 5 y 6, cambiar dps

        const process = await sequelizeDB.query(q);
        res.send(process[0]);

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

RecordController.recordRequestFilter = async(req, res) => {

    const idFaculty = req.body.idFacultad;
    const arrayState = req.body.arrayEstados; //Formato: [1, 2, 3]
    const arrayConstancy = req.body.arrayConstancias;
    const arraySpecialty = req.body.arrayEspecialidades; //Cuando elijas un local, sale este cuadrito.

    try {
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
        ON p.state_process = pst.idprocess_state
        WHERE p.code is not null`

        //Filtro facultad
        if (idFaculty != null && idFaculty != '') {
            q = q + ` AND f.id = ` + idFaculty;
        }

        //Filtro estados
        var s = '(';
        if (arrayState != null && arrayState.length > 0) {
            arrayState.forEach(function(stateValue, index, array) {
                if ((index + 1) != arrayState.length) { //Esto le da el formato (1,2,...,n)
                    s = s + stateValue + ',';
                } else {
                    s = s + stateValue + ')';
                }
            });
            q = q + ` AND p.state_process IN ` + s;
        }

        //Filtro constancias
        var c = '(';
        if (arrayConstancy != null && arrayConstancy.length > 0) {
            arrayConstancy.forEach(function(constancyValue, index, array) {
                if ((index + 1) != arrayConstancy.length) {
                    c = c + constancyValue + ',';
                } else {
                    c = c + constancyValue + ')';
                }
            });
            q = q + ` AND p.constancy_id IN ` + c;
            console.log(q);
        }

        //Filtro especialidades
        var e = '(';
        if (arraySpecialty != null && arraySpecialty.length > 0) {
            arraySpecialty.forEach(function(specialtyValue, index, array) {
                if ((index + 1) != arraySpecialty.length) {
                    e = e + specialtyValue + ',';
                } else {
                    e = e + specialtyValue + ')';
                }
            });
            q = q + ` AND ps.specialty_id IN ` + e;
            console.log(q);
        }

        const process = await sequelizeDB.query(q);
        res.send(process[0]);

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

module.exports = RecordController;