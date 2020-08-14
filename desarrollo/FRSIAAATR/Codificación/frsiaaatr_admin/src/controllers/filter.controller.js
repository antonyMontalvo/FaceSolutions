const bcrypt = require("bcryptjs");
"use strict";

const Department = require("../models/department"), //pongo Employee porque es un modelo
    { createToken, getPayload } = require("../services/jwt"),
    FilterController = {};

const { QueryTypes } = require('sequelize');
const { sequelizeDB } = require("../../config/database");

FilterController.getAllFaculties = async(req, res) => {
    const q = `SELECT id,name from faculty`;
    const process = await sequelizeDB.query(q);
    res.send(process[0]);
}

FilterController.getFaculties = async(req, res) => {
    const id = req.params.id;
    const q = `SELECT id,name from faculty where id = ` + id;
    const process = await sequelizeDB.query(q);
    res.send(process[0]);
}

FilterController.getAllSpecialties = async(req, res) => {
    try {
        //Devolver las especialidades a select2 de filtro.
        const q = `SELECT id,name from specialty`;
        const process = await sequelizeDB.query(q);
        res.send(process[0]);

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

FilterController.getSpecialties = async(req, res) => {
    try {
        const id = req.params.id;
        const q = `SELECT id,name from specialty where faculty_id = ` + id;
        const process = await sequelizeDB.query(q);
        res.send(process[0]);

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Estados de solicitud (process)
FilterController.getProcessState = async(req, res) => {
    try {
        const q = `SELECT 
            idprocess_state as idProcessState, 
            state_name as stateName 
            FROM process_state`;
        const result = await sequelizeDB.query(q);
        res.send(result[0]);
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

module.exports = FilterController;