const bcrypt = require("bcryptjs");
const { sequelizeDB } = require("../../config/database");

const Employee = require("../models/department"), //pongo Employee porque es un modelo
    { createToken, getPayload } = require("../services/jwt"),
    PostulantController = {},
    saltRounds = 10;

/* 
 * Vistas
 * Información básica de postulante
 * Lista (tabla) de postulantes
 * Revisión de requisitos de postulante (Fotos)
 */

/*
 * Endpoints
 * Revisión de requisitos (fotos del postulante)
 * Tabla donde se visualiza pequeña info del postulante
 */

//Información básica del postulante
PostulantController.getDetailPostulant = async(req, res) => {
    try {
        res.render("postulant/basicInformation");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Lista de postulantes
PostulantController.getPostulantList = async(req, res) => {
    try {
        res.render("postulantRequirement/postulantList");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Revisar requisitos (fotos) de postulante
PostulantController.getReviewInfo = async(req, res) => {
    try {
        res.render("postulantRequirement/reviewRequirement");

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Lista de postulantes (para la tabla - lista)
PostulantController.getAllPostulant = async(req, res) => {
    try {

        const q = `SELECT
            ps.postulant_code as codigoPostulante,
            concat_ws(' ', ps.name, ps.last_name_1, ps.last_name_2) as nombreCompleto,
            ps.dni as dni,
            ps.sexo as sexoPostulante,
            ps.date_postulation as fechaPostulacion,
            sp.name as especialidadPostulada,
            f.name as facultadPostulada,
            concat_ws(' - ', dp.name, pr.name, d.name) as procedenciaPostulante
        FROM postulant ps
        LEFT JOIN specialty sp
        ON ps.specialty_id = sp.id
        LEFT JOIN faculty f
        ON sp.faculty_id = f.id
        LEFT JOIN district d
        ON ps.district_id = d.id
        LEFT JOIN province pr
        ON d.province_id = pr.id
        LEFT JOIN department dp
        ON pr.department_id = dp.id`;

        const result = await sequelizeDB.query(q);
        res.send(result[0]);

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Informacion del postulante (tabla a la derecha)
PostulantController.getPostulantInfo = async(req, res) => {
    try {

        const idPostulant = req.params.idPostulante; //Se saca de la ruta

        const q = `SELECT
            ps.postulant_code as codigoPostulante,
            concat_ws(' ', ps.name, ps.last_name_1, ps.last_name_2) as nombreCompleto,
            ps.dni as dni,
            ps.sexo as sexoPostulante,
            ps.date_postulation as fechaPostulacion,
            sp.name as especialidadPostulada,
            f.name as facultadPostulada,
            concat_ws(' - ', dp.name, pr.name, d.name) as procedenciaPostulante
        FROM postulant ps
        LEFT JOIN specialty sp
        ON ps.specialty_id = sp.id
        LEFT JOIN faculty f
        ON sp.faculty_id = f.id
        LEFT JOIN district d
        ON ps.district_id = d.id
        LEFT JOIN province pr
        ON d.province_id = pr.id
        LEFT JOIN department dp
        ON pr.department_id = dp.id
        WHERE ps.postulant_code = ` + idPostulant;

        const result = await sequelizeDB.query(q);
        res.send(result[0]);

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Lista de requisitos según postulante
PostulantController.getAllRequirement = async(req, res) => {
    try {
        const idPostulant = req.params.idPostulante; //Viene desde la ruta

        const q = `SELECT
            pr.idpost_req as idRequisito,
            pr.name as nombreRequisito,
            pr.path as rutaRequisito,
            pr.state as estadoRequisito,
            pr.observation as observacionRequisito
        FROM postulant_requirements pr
        WHERE pr.idpostulant = ` + idPostulant;

        const result = await sequelizeDB.query(q);
        res.send(result[0]);

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Actualizar estado de un requisito (foto)
PostulantController.updateRequirementPostulant = async(req, res) => {
    try {

        const idRequirement = req.body.idRequisito;
        const newState = req.body.estado;
        const observation = req.body.observacion;
        const idPostulant = req.body.idPostulante;

        //Actualizando estado de requisito/foto (Aprobado o Observado)
        var q = `UPDATE postulant_requirements pr
            SET	pr.state = ` + newState + `,
                pr.observation = '` + observation + `' ,
                pr.date_updated = NOW() 
            WHERE pr.idpostulant = ` + idPostulant + `
            AND pr.idpost_req = ` + idRequirement;

        await sequelizeDB.query(q);

        //Devolviendo el requisito actualizado (y el estado de la solicitud)
        var q2 = `SELECT
            pr.idpost_req as idRequisito,
            pr.name as nombreRequisito,
            pr.path as rutaRequisito,
            pr.state as estadoRequisito,
            pr.observation as observacionRequisito
        FROM postulant_requirements pr
        WHERE pr.idpostulant = ` + idPostulant + `
        AND pr.idpost_req = ` + idRequirement;

        var result = await sequelizeDB.query(q2);
        res.send(result[0]);

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

module.exports = PostulantController;