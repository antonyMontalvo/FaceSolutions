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

EmployeesController.getAllProcess = async(req, res) => {
    try {

        const q = 'SELECT p.code, p.date_created, p.state, ps.name, ps.last_name_1, ps.last_name_2, c.name FROM process p LEFT JOIN postulant ps ON p.postulant_id = ps.id LEFT JOIN constancy c ON p.constancy_id = c.id';

        const process = await sequelizeDB.query(q);
        //console.log(process);
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
    (async () => {
    try{
    
    let browser = null;

    const file = fs.readFileSync('./src/template/constancy.html', 'utf8');
    const template = handlebars.compile(file);
    const html = template({name:"Evelin Sofía Pariona Gutierrez"});
     
    browser = await puppeteer.launch({
        pipe: true,
        args: ['--headless', '--disable-gpu', '--full-memory-crash-report', '--unlimited-storage',
               '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ path: "./pdf/constancy.pdf", format: "Letter" });
    await browser.close();
    
    res.send(200);

    }catch(error){
        console.log(error);
    }
    })();

    
};

module.exports = EmployeesController;