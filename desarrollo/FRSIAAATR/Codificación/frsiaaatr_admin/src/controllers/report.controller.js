const bcrypt = require("bcryptjs");
"use strict";

const { QueryTypes } = require('sequelize');
const { sequelizeDB } = require("../../config/database");

const Employee = require("../models/department"), //pongo Employee porque es un modelo
    { createToken, getPayload } = require("../services/jwt"),
    ReportController = {};

ReportController.getReportRequestsView = async(req, res) => {
    try {
        res.render("report/requestReport");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

ReportController.getReportRequests = async(req, res) => {
    try {

        const idFaculty = req.body.idFacultad;
        const idSpecialty = req.body.idEspecialidad;

        let q = `SELECT
            p.state_process as idEstado,
            ps.state_name as nombreEstado,
            f.id as idFacultad,
            f.name as nombreFacultad,
            f.initials as siglaFacultad,
            s.id as idEspecialidad,
            s.name as nombreEspecialidad,
            s.initials as siglaEspecialidad,
            COUNT(p.state_process) as cantidadSolicitudes
        FROM process p
        LEFT JOIN process_state ps
        ON p.state_process = ps.idprocess_state
        LEFT JOIN postulant pt
        ON p.postulant_id = pt.id
        LEFT JOIN specialty s
        ON pt.specialty_id = s.id
        LEFT JOIN faculty f
        ON s.faculty_id = f.id`;

        if (idFaculty != null && idSpecialty != null) {
            q = q + ` WHERE f.id = ` + idFaculty + ` AND s.id = ` + idSpecialty;
        }

        q = q + ` group by p.state_process, ps.state_name, s.name, f.initials, s.initials, f.id, s.id
        order by s.id`;

        const process = await sequelizeDB.query(q);
        res.send(process[0]);

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
}

module.exports = ReportController;