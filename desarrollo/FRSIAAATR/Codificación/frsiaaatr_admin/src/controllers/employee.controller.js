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

    (async () => {
    try{
    const htmlFile = path.resolve("./src/template/constancy.html");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("file://" + htmlFile);
    await page.pdf({ path: "./pdf/constancy.pdf", format: "Letter" });
    await browser.close(); 
    console.log("Generacion correcta");

    /*const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://google.com"); 
    await page.pdf({ path: "./google.pdf", format: "Letter" });
    await browser.close();*/
    }catch(error){
        console.log(error);
    }
    })();

    
};

module.exports = EmployeesController;