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

//Actualizar estado de requisito y registrar en seguimiento
ConstancyController.updateRequestState = async(req, res) => {

    const stateRequirement = req.body.state; //Estado de Requerimiento
    const idProcess = req.body.idProcess; //id de Solicitud
    const idRequirement = req.body.idRequirement; //id de Requerimiento
    const observation = req.body.observation;

    //Actualizando estado de requisito
    var q = `UPDATE requirement r 
        SET r.state_requirement = ` + stateRequirement +
        `, r.description = '` + observation +
        `' WHERE r.process_id = ` + idProcess +
        ` AND r.idrequirement = ` + idRequirement;

    await sequelizeDB.query(q);

    //Si se va a observar...
    if (stateRequirement == 2) {
        var q2 = `SELECT
        state_requirement as estadoRequisito, 
        COUNT(state_requirement) as cantidadRequisitos
        FROM requirement 
        WHERE process_id = ` + idProcess +
            ` GROUP BY state_requirement`;

        var stateQty = await sequelizeDB.query(q2);
        var arrayState = stateQty[0];

        var requestObs = false,
            newRequestState;
        arrayState.forEach(function(r, index, value) {
            //Contando la cantidad de requisitos observados de la solcitud
            if (r.estadoRequisito == 2 && r.cantidadRequisitos >= 1) {
                requestObs = true;
                newRequestState = 2;
            }
            //Falta cambiar que cuando todos esten aprobados, cambie el estadito también... 
        });

        //Si tiene al menos un requisito observado, la solicitud se observa
        if (requestObs) {
            var q3 = `UPDATE process p 
                SET p.state_process = ` + newRequestState +
                ` WHERE p.id = ` + idProcess;

            await sequelizeDB.query(q3);
        }
    }

    //Devolviendo el requisito actualizado (y el estado de la solicitud)
    var q4 = `SELECT r.*, rs.state_name, p.state_process, ps.state_name as state_name_process FROM requirement r
        LEFT JOIN requirement_state rs
        ON r.state_requirement = rs.idrequirement_state
        LEFT JOIN process p
        ON r.process_id = p.id
        LEFT JOIN process_state ps
        ON p.state_process = ps.idprocess_state
        WHERE r.idrequirement = ` + idRequirement +
        ` AND r.process_id = ` + idProcess;
    var result = await sequelizeDB.query(q4);

    res.send(result[0]);

}

/* //Lista de solicitudes Derivadas
ConstancyController.getRequestInDerivedList = async(req, res) => {
    try {
        res.render("constancy/requestInDerived");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

//Solicitud Derivada
ConstancyController.getRequestInDerivedConstancy = async(req, res) => {
    try {
        res.render("constancy/derivedConstancy");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
}; */

module.exports = ConstancyController;