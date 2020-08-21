const bcrypt = require("bcryptjs");
("use strict");

const Department = require("../models/department"), //pongo Employee porque es un modelo
  { createToken, getPayload } = require("../services/jwt"),
  EmployeesController = {},
  saltRounds = 10;

const { QueryTypes } = require("sequelize");
const { sequelizeDB } = require("../../config/database");

EmployeesController.getEmployees = async (req, res) => {
  try {
    // const employees = await Department.findAll();
    /*const employees = await sequelizeDB.query('select * from postulant where name = ?', {
            replacements: ['chros'],
            type: QueryTypes.SELECT
        });*/
    const facultades = await sequelizeDB.query("select * from faculty");
    console.log(facultades);

    res.render("employee/index", { title: "dddd", data: facultades });
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ error: error.stack });
  }
};

EmployeesController.generatePdf = async (req, res) => {
  const path = require("path");
  const puppeteer = require("puppeteer");
  const handlebars = require("handlebars");
  var fs = require("fs");
  var express = require("express");
  var hbs = require("express-handlebars");

  var app = express();

  app.engine("hbs", hbs({ extname: "hbs" }));
  app.set("view engine", "hbs");
  app.use(express.static(path.join(__dirname, "public")));
  (async () => {
    try {
      let browser = null;

      const file = fs.readFileSync("./src/template/constancy.html", "utf8");
      const template = handlebars.compile(file);
      const html = template({
        name: "Evelin Sofia Pariona Gutierrez",
        dni: "09988830",
        puntaje: "1350.50",
      });

      browser = await puppeteer.launch({
        pipe: true,
        args: [
          "--headless",
          "--disable-gpu",
          "--full-memory-crash-report",
          "--unlimited-storage",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
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

EmployeesController.generatePdfWithoutSignatures = async (req, res) => {
  const path = require("path");
  const puppeteer = require("puppeteer");
  const handlebars = require("handlebars");
  var fs = require("fs");
  var express = require("express");
  var hbs = require("express-handlebars");

  var app = express();

  app.engine("hbs", hbs({ extname: "hbs" }));
  app.set("view engine", "hbs");
  app.use(express.static(path.join(__dirname, "public")));
  (async () => {
    try {
      let browser = null;

      const file = fs.readFileSync(
        "./src/template/constancy_without_signatures.html",
        "utf8"
      );
      const template = handlebars.compile(file);
      const html = template({
        name: "Evelin Sofia Pariona Gutierrez",
        dni: "09988830",
        puntaje: "1350.50",
      });

      browser = await puppeteer.launch({
        pipe: true,
        args: [
          "--headless",
          "--disable-gpu",
          "--full-memory-crash-report",
          "--unlimited-storage",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
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
