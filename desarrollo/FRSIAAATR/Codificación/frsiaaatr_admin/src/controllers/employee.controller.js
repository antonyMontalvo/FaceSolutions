const bcrypt = require("bcryptjs");
"use strict";

const Department = require("../models/department"), //pongo Employee porque es un modelo
    { createToken, getPayload } = require("../services/jwt"),
    EmployeesController = {},
    saltRounds = 10;

const { QueryTypes } = require('sequelize');
const { sequelizeDB } = require("../../config/database");

EmployeesController.getEmployees = async(req, res) => {
    try {
        // const employees = await Department.findAll();
        /*const employees = await sequelizeDB.query('select * from postulant where name = ?', {
            replacements: ['chros'],
            type: QueryTypes.SELECT
        });*/
        const facultades = await sequelizeDB.query('select * from faculty');
        console.log(facultades);

        res.render("employee/index", { title: 'dddd', data: facultades });
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

EmployeesController.getAllFaculties = async(req, res) => {
    const q = `SELECT id,name from faculty`;
    const process = await sequelizeDB.query(q);
    res.send(process[0]); 
}

EmployeesController.getFaculties = async(req, res) => {
    const id = req.params.id;
    const q = `SELECT id,name from faculty where id = `+ id;
    const process = await sequelizeDB.query(q);
    res.send(process[0]); 
}

EmployeesController.getAllSpecialties = async(req, res) => {
    try{
        //Devolver las especialidades a select2 de filtro.
        const q = `SELECT id,name from specialty`;
        const process = await sequelizeDB.query(q);
        res.send(process[0]);

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

EmployeesController.getSpecialties = async(req, res) => {
    try{
        const id = req.params.id;
        const q = `SELECT id,name from specialty where faculty_id = `+id;
        const process = await sequelizeDB.query(q);
        res.send(process[0]);

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }
};

EmployeesController.getAllProcess = async(req, res) => {
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

EmployeesController.generatePdf = async(req, res) => {

    const path = require("path");
    const puppeteer = require("puppeteer");
    const handlebars = require("handlebars");
    var fs = require('fs');
    var express = require("express");
    var hbs = require("express-handlebars");

    var app = express();

    app.engine('hbs', hbs({ extname: 'hbs' }));
    app.set('view engine', 'hbs');
    app.use(express.static(path.join(__dirname, 'public')));
    (async() => {
        try {

            let browser = null;

            const file = fs.readFileSync('./src/template/constancy.html', 'utf8');
            const template = handlebars.compile(file);
            const html = template({ name: "Evelin Sofia Pariona Gutierrez", dni: "09988830", puntaje: "1350.50" });

            browser = await puppeteer.launch({
                pipe: true,
                args: ['--headless', '--disable-gpu', '--full-memory-crash-report', '--unlimited-storage',
                    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'
                ],
            });

            const page = await browser.newPage();
            await page.setContent(html);
            await page.pdf({ path: "./pdf/constancy.pdf", format: "Letter" });
            await browser.close();

            res.send("Se firmó la constancia satisfactoriamente");

        } catch (error) {
            console.log(error);
        }
    })();


};

EmployeesController.generatePdfWithoutSignatures = async(req, res) => {

    const path = require("path");
    const puppeteer = require("puppeteer");
    const handlebars = require("handlebars");
    var fs = require('fs');
    var express = require("express");
    var hbs = require("express-handlebars");

    var app = express();

    app.engine('hbs', hbs({ extname: 'hbs' }));
    app.set('view engine', 'hbs');
    app.use(express.static(path.join(__dirname, 'public')));
    (async() => {
        try {

            let browser = null;

            const file = fs.readFileSync('./src/template/constancy_without_signatures.html', 'utf8');
            const template = handlebars.compile(file);
            const html = template({ name: "Evelin Sofia Pariona Gutierrez", dni: "09988830", puntaje: "1350.50" });

            browser = await puppeteer.launch({
                pipe: true,
                args: ['--headless', '--disable-gpu', '--full-memory-crash-report', '--unlimited-storage',
                    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'
                ],
            });

            const page = await browser.newPage();
            await page.setContent(html);
            await page.pdf({ path: "./pdf/constancy.pdf", format: "Letter" });
            await browser.close();

            res.send("Se generó la constancia satisfactoriamente");

        } catch (error) {
            console.log(error);
        }
    })();


};

module.exports = EmployeesController;