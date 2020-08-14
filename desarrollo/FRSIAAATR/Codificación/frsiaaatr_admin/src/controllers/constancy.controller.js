const bcrypt = require("bcryptjs");
"use strict";

const { QueryTypes } = require('sequelize');
const { sequelizeDB } = require("../../config/database");

const Employee = require("../models/department"),
    { createToken, getPayload } = require("../services/jwt"),
    ConstancyController = {},
    saltRounds = 10;

//Información de solicitud no leída (vista)
ConstancyController.getReviewUnreadInfo = async(req, res) => {

    const id = req.params.id;

    try {
        res.render("constancy/reviewRequest", {
            layout: "main",
            data: { idRequest: id }
        });
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Lista de solicitudes No Leídas (vista)
ConstancyController.getRequestUnreadList = async(req, res) => {

    try {
        res.render("constancy/requestUnread"); //Id de solicitud recibida desde ruta
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
        ON p.state_process = pst.idprocess_state
        WHERE p.state_process IN (1, 2, 3)`; //No leído, observado, aprobado

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

//Listado de requisitos de solicitud
ConstancyController.getAllReviewRequest = async(req, res) => {

    const idReview = req.params.id;

    let q = `SELECT
        p.code as codigoSolicitud,
        r.idrequirement as codigoRequisito,
        r.name as nombreRequisito,
        r.description as observacionRequisito,
        r.date_created as fechaRequisito,
        r.state_requirement as estadoRequisito,
        rq.state_name as nombreEstadoRequisito
    FROM requirement r
    LEFT JOIN process p ON
    r.process_id = p.id
    LEFT JOIN requirement_state rq ON
    r.state_requirement = rq.idrequirement_state
    WHERE p.code = ` + idReview;

    const result = await sequelizeDB.query(q);
    res.send(result[0]);
}

//Información de postulante (solicitud)
ConstancyController.getPostulantRequestInfo = async(req, res) => {

    const idReview = req.params.id;

    var q = `SELECT
    p.id as idSolicitud, 
    p.code as codigoSolicitud,
    p.state_process as estadoSolicitud,
    pst.state_name as nombreEstadoSolicitud,  
    p.date_created as fechaSolicitud,
    p.date_updated as fechaCambio,
    c.name as nombreConstancia,
    ps.name as nombre, 
    ps.last_name_1 as apellidoPaterno, 
    ps.last_name_2 as apellidoMaterno,
    concat_ws(' ', ps.name, ps.last_name_1, ps.last_name_2) as nombreCompleto,  
    ps.postulant_code as codigoPostulante,
    ps.email as email,
    ps.dni as numeroDocumento
    FROM 
    process p LEFT JOIN postulant ps 
    ON p.postulant_id = ps.id 
    LEFT JOIN constancy c 
    ON p.constancy_id = c.id
    LEFT JOIN process_state pst
    ON p.state_process = pst.idprocess_state
    WHERE p.code = ` + idReview;

    const result = await sequelizeDB.query(q);
    res.send(result[0]);

}

//Actualizar estado de requisito (y solicitud general según estados de requisitos)
ConstancyController.updateRequirementState = async(req, res) => {

    const stateRequirement = req.body.state; //Estado de Requerimiento
    const idProcess = req.body.idProcess; //id de Solicitud
    const idRequirement = req.body.idRequirement; //id de Requerimiento
    const observation = req.body.observation;

    //Actualizando estado de requisito (Aprobado o Observado)
    var q = `UPDATE requirement r 
        SET r.state_requirement = ` + stateRequirement +
        `, r.description = '` + observation +
        `' WHERE r.process_id = ` + idProcess +
        ` AND r.idrequirement = ` + idRequirement;

    await sequelizeDB.query(q);

    //Total requisitos
    var q2 = `SELECT COUNT(*) as cantidadRequisitos FROM requirement WHERE process_id = ` + idProcess;
    var t = await sequelizeDB.query(q2);
    var totalQty = t[0];

    //Cuando se observe (2) o se apruebe (4)...
    var q3 = `SELECT
        state_requirement as estadoRequisito, 
        COUNT(state_requirement) as cantidadRequisitos
        FROM requirement 
        WHERE process_id = ` + idProcess +
        ` GROUP BY state_requirement`;

    var stateQty = await sequelizeDB.query(q3);
    //Devuelve los estados de los requisitos y cuanto hay de cada estado
    var arrayState = stateQty[0];

    var requestObs = false,
        requestAprob = false,
        newRequestState;

    //Contando la cantidad de requisitos observados de la solcitud
    arrayState.forEach(function(r, index, value) {

        //Si existe más de un estado observado (2)
        if (r.estadoRequisito == 2 && r.cantidadRequisitos >= 1) {
            requestObs = true;
            newRequestState = 2; //Solicitud OBSERVADA
        }

        //Si todos los requisitos estan aprobados (4)
        if (r.estadoRequisito == 4 && r.cantidadRequisitos == totalQty[0].cantidadRequisitos) {
            requestAprob = true;
            newRequestState = 3; //Solicitud APROBADA
        }

    });

    //Si hay un requisito observado o todos estan aprobados, se actualiza el estado general de la solicitud
    if (requestObs || requestAprob) {
        var q4 = `UPDATE process p 
                SET p.state_process = ` + newRequestState + //2 ó 3
            ` WHERE p.id = ` + idProcess;

        await sequelizeDB.query(q4);
    }

    //Devolviendo el requisito actualizado (y el estado de la solicitud)
    var q5 = `SELECT r.*, rs.state_name, p.state_process, ps.state_name as state_name_process FROM requirement r
        LEFT JOIN requirement_state rs
        ON r.state_requirement = rs.idrequirement_state
        LEFT JOIN process p
        ON r.process_id = p.id
        LEFT JOIN process_state ps
        ON p.state_process = ps.idprocess_state
        WHERE r.idrequirement = ` + idRequirement +
        ` AND r.process_id = ` + idProcess;
    var result = await sequelizeDB.query(q5);

    res.send(result[0]);

}

//Actualizar solo el estado de la solicitud
ConstancyController.updateRequestState = async(req, res) => {

    try {

        const idProcess = req.body.id;
        var newRequestState = req.body.state;

        var q = `UPDATE process p 
                SET p.state_process = ` + newRequestState +
            ` WHERE p.id = ` + idProcess;

        await sequelizeDB.query(q);
        res.send("Aprobado");

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }



}

module.exports = ConstancyController;