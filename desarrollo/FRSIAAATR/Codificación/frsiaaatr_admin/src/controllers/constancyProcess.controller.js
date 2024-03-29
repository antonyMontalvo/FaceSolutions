const bcrypt = require("bcryptjs");
("use strict");
const { QueryTypes } = require("sequelize");
const { sequelizeDB } = require("../../config/database");
const ConstancyController = require("./constancy.controller");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
var fs = require("fs");
var express = require("express");
var hbs = require("express-handlebars");

const Employee = require("../models/department"),
  { createToken, getPayload } = require("../services/jwt"),
  ConstancyProcessController = {};

//Crear un metodo
/* updated process set document_category = + tipo_documento +  and document_description = + asunto 
   where code = + numero_expediente;

*/

ConstancyProcessController.privateConstancy = async (req, res) => {
  try {
    const id_constancia = req.body.id_constancia;
    console.log("id_constancia", id_constancia);
    let q =
      `UPDATE process p SET p.state_process=8 WHERE p.code = '` +
      id_constancia +
      `';`;

    //let q = `UPDATE process p SET p.document_category = 'Constancia de Ingreso' , p.document_description = 'sdkjdskjsdjk' WHERE p.code =  '00002';`;
    const process = await sequelizeDB.query(q);
  } catch (error) {
    return res.status(500).json({ error: error.stack });
  }
};

ConstancyProcessController.cancelConstancy = async (req, res) => {
  try {
    const id_constancia = req.body.id_constancia;
    console.log("id_constancia", id_constancia);
    let q =
      `UPDATE process p SET p.state_process=7 WHERE p.code = '` +
      id_constancia +
      `';`;

    //let q = `UPDATE process p SET p.document_category = 'Constancia de Ingreso' , p.document_description = 'sdkjdskjsdjk' WHERE p.code =  '00002';`;
    const process = await sequelizeDB.query(q);
  } catch (error) {
    return res.status(500).json({ error: error.stack });
  }
};
ConstancyProcessController.updatedConstancy = async (req, res) => {
  try {
    const id_constancia = req.body.id_constancia;
    const tipo_documento = req.body.tipo_documento;
    const asunto = req.body.asunto;

    if (id_constancia !== undefined || id_constancia !== null) {
      let q =
        `UPDATE process p SET p.document_category = '` +
        tipo_documento +
        `' , p.document_description = '` +
        asunto +
        `' WHERE p.code =  '` +
        id_constancia +
        `';`;

      //let q = `UPDATE process p SET p.document_category = 'Constancia de Ingreso' , p.document_description = 'sdkjdskjsdjk' WHERE p.code =  '00002';`;

      const process = await sequelizeDB.query(q);
      console.log("se grabo");
    }
  } catch (error) {
    //console.log(error);
    console.log(error.stack);
    return res.status(500).json({ error: error.stack });
  }
};

ConstancyProcessController.derivedConstancy = async (req, res) => {
  try {
    const id_constancia = req.body.id_constancia;
    console.log("id_constancia", id_constancia);
    let q =
      `UPDATE process p SET p.state_process=8 WHERE p.code = '` +
      id_constancia +
      `';`;

    //let q = `UPDATE process p SET p.document_category = 'Constancia de Ingreso' , p.document_description = 'sdkjdskjsdjk' WHERE p.code =  '00002';`;
    const process = await sequelizeDB.query(q);
  } catch (error) {
    return res.status(500).json({ error: error.stack });
  }
};

//BOTON GENERAR PDF
ConstancyProcessController.getProcessByDni = async (req, res) => {
  console.log("ENTRE"); 
  // const path = require("path");
  // const puppeteer = require("puppeteer");
  // const handlebars = require("handlebars");
  // var fs = require("fs");
  // var express = require("express");
  // var hbs = require("express-handlebars");
  //var toastr = require("express-toastr");
  // var app = express();

  // app.engine("hbs", hbs({ extname: "hbs" }));
  // app.set("view engine", "hbs");
  // app.use(express.static(path.join(__dirname, "public")));
  //app.use(toastr());
  var hoy = new Date();
  var dd = hoy.getDate();
  var mm = hoy.getMonth() + 1;
  var yyyy = hoy.getFullYear();
  var fecha_actual = dd + "/" + mm + "/" + yyyy;
  const dni2 = req.params.dni; 
  console.log("DNI RECIBIDO: " + dni2);
  //CONSULTA PARA DATOS ASOCIADOS A LA CONSTANCIA Y SOLICITANTE
  let q =
    `select  
        concat_ws(' ', ps.name, ps.last_name_1, ps.last_name_2) as solicitante,
        ps.dni as dni,
        f.name as facultad,
        sp.name as especialidad,
        p.code as numero_expediente,
        p.date_created as fecha_expediente_completa,
        cast(p.date_created as date) as fecha_expediente,
        EXTRACT(YEAR FROM p.date_created) as año,
        SUBSTR(p.code,3) as numero_emision,
        pt.state_name as estado_expediente,
        concat_ws(' ', ad.name, ad.last_name_1, ad.last_name_2) as encargado_expediente,
        p.document as documento
        from postulant ps 
        left join specialty sp on sp.id = ps.specialty_id
        left join faculty f on sp.faculty_id = f.id
        left join process p on p.postulant_id = ps.id
        left join process_state pt on p.state_process = pt.idprocess_state
        left join administrator ad on p.administrator_id = ad.id
        where ps.dni = ` + dni2;
        
  const process = await sequelizeDB.query(q);

  //CONSULTA PARA VERIFICAR EXISTENCIA DE DOCUMENTO PDF
  let m = `SELECT url_constancy from process where code='`+process[0][0]["numero_expediente"]+"';"
  console.log(m);
  const result = await sequelizeDB.query(m);
  console.log("URL recibida: "+result[0][0]["url_constancy"]);
  if(result[0][0]["url_constancy"]==null || result[0][0]["url_constancy"]==""){
      //COMO NO EXISTE, SE PROCEDE A GENERAR EL PDF
      console.log("Se generara la constancia pdf");
      //ACTUALIZAR EL CAMPO URL_CONSTANCY CON EL NOMBRE DEL DOCUMENTO PDF  
      let s =`UPDATE process SET url_constancy = 'Constancy_N` +
      dni2 +  `' WHERE code= '` +process[0][0]["numero_expediente"]+"'";
      const p = await sequelizeDB.query(s);
      console.log(s);
      //res.send(process[0]);
      try {
        //CAPTURAR VARIABLES DE SQL
        var solicitante = process[0][0]["solicitante"];
        var dni = process[0][0]["dni"];
        var facultad = process[0][0]["facultad"];
        var especialidad = process[0][0]["especialidad"];
        var numero_expediente = process[0][0]["numero_expediente"];
        var fecha_expediente_completa = process[0][0]["fecha_expediente_completa"];
        var anio = process[0][0]["año"];
        var numero_emision = process[0][0]["numero_emision"];
        var estado_expediente = process[0][0]["estado_expediente"];
        var encargado_expediente = process[0][0]["encargado_expediente"];
    
        let browser = null;

        const file = fs.readFileSync(
            path.join(__dirname,"../template/constancy_without_signatures.html"),
          "utf8"
        );
        const template = handlebars.compile(file);
        const html = template({
          name: solicitante,
          dni: dni,
          especialidad: especialidad,
          facultad: facultad,
          puntaje: "1530.00",
        });

        browser = await puppeteer.launch({
          pipe: true,
          headless: false,
	        //executablePath: '/usr/bin/google-chrome',
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

        //SIN FIRMAS
        const page = await browser.newPage();
        await browser.close();

        await page.setContent(html);
        await page.pdf({
          // path: "./src/public/pdf/Constancy_N" + dni + ".pdf",
          path: path.join(__dirname, "../public/pdf/Constancy_N" + dni + ".pdf"),
          format: "Letter",
        });
        res.sendStatus(200);
    }catch(e){
      console.log(e);
      res.sendStatus(400);
    }

  }else{
    //EL DOCUMENTO YA ESTA REGISTRADO EN LA BD
    console.log("El documento pdf ya existe");
    res.sendStatus(400);
  }
  
};

ConstancyProcessController.getProcess = async (req, res) => {
  // const path = require("path");
  // const puppeteer = require("puppeteer");
  // const handlebars = require("handlebars");
  // var fs = require("fs");
  // var express = require("express");
  // var hbs = require("express-handlebars");
  //
  // var app = express();
  //
  // app.engine("hbs", hbs({ extname: "hbs" }));
  // app.set("view engine", "hbs");
  // app.use(express.static(path.join(__dirname, "public")));

  var hoy = new Date();
  var dd = hoy.getDate();
  var mm = hoy.getMonth() + 1;
  var yyyy = hoy.getFullYear();

  var fecha_actual = dd + "/" + mm + "/" + yyyy;

  //Codigo de la solicitud
  const id = req.params.id;
  let q =
    `select 
	concat_ws(' ', ps.name, ps.last_name_1, ps.last_name_2) as solicitante,
    ps.dni as dni,
    f.name as facultad,
    sp.name as especialidad,
	p.code as numero_expediente,
    p.date_created as fecha_expediente_completa,
    cast(p.date_created as date) as fecha_expediente,
    EXTRACT(YEAR FROM p.date_created) as año,
    SUBSTR(p.code,3) as numero_emision,
    pt.state_name as estado_expediente,
    concat_ws(' ', ad.name, ad.last_name_1, ad.last_name_2) as encargado_expediente,
    p.document as documento
    from postulant ps 
    left join specialty sp on sp.id = ps.specialty_id
    left join faculty f on sp.faculty_id = f.id
    left join process p on p.postulant_id = ps.id
    left join process_state pt on p.state_process = pt.idprocess_state
    left join administrator ad on p.administrator_id = ad.id
    where p.code = ` + id;
  console.log(q);
  const process = await sequelizeDB.query(q);
  //res.send(process[0]);
  try {
    var solicitante = process[0][0]["solicitante"];
    var dni = process[0][0]["dni"];
    var facultad = process[0][0]["facultad"];
    var especialidad = process[0][0]["especialidad"];
    var numero_expediente = process[0][0]["numero_expediente"];
    var fecha_expediente_completa = process[0][0]["fecha_expediente_completa"];
    var anio = process[0][0]["año"];
    var numero_emision = process[0][0]["numero_emision"];
    var estado_expediente = process[0][0]["estado_expediente"];
    var encargado_expediente = process[0][0]["encargado_expediente"];

    res.render("constancy/derivedConstancy", {
      solicitante: solicitante,
      dni: dni,
      facultad: facultad,
      especialidad: especialidad,
      numero_expediente: numero_expediente,
      fecha_expediente_completa: fecha_expediente_completa,
      anio: anio,
      numero_emision: numero_emision,
      estado_expediente: estado_expediente,
      encargado_expediente: encargado_expediente,
      fecha_actual: fecha_actual,
      succesfull: "",
    });
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ error: error.stack });
  }
};

// EmployeesController.generatePdf = async (req, res) => {
//   const path = require("path");
//   const puppeteer = require("puppeteer");
//   const handlebars = require("handlebars");
//   var fs = require("fs");
//   var express = require("express");
//   var hbs = require("express-handlebars");

//   var app = express();

//   app.engine("hbs", hbs({ extname: "hbs" }));
//   app.set("view engine", "hbs");
//   app.use(express.static(path.join(__dirname, "public")));
//   (async () => {
//     try {
//       let browser = null;

//       const file = fs.readFileSync("./src/template/constancy.html", "utf8");
//       const template = handlebars.compile(file);
//       const html = template({
//         name: "Evelin Sofia Pariona Gutierrez",
//         dni: "09988830",
//         puntaje: "1350.50",
//       });

//       browser = await puppeteer.launch({
//         pipe: true,
//         args: [
//           "--headless",
//           "--disable-gpu",
//           "--full-memory-crash-report",
//           "--unlimited-storage",
//           "--no-sandbox",
//           "--disable-setuid-sandbox",
//           "--disable-dev-shm-usage",
//         ],
//       });

//       const page = await browser.newPage();
//       await page.setContent(html);
//       await page.pdf({ path: "./pdf/constancy.pdf", format: "Letter" });
//       await browser.close();

//       res.send("Se firmó la constancia satisfactoriamente");
//     } catch (error) {
//       console.log(error);
//     }
//   })();
// };

ConstancyProcessController.getRequestProcess = async (req, res) => {
  const id = req.params.id;
  /*let q = `select 
	concat_ws(' ', ps.name, ps.last_name_1, ps.last_name_2) as solicitante,
    ps.dni as dni,
    f.name as facultad,
    sp.name as especialidad,
	p.code as numero_expediente,
    p.date_created as fecha_expediente_completa,
    cast(p.date_created as date) as fecha_expediente,
    EXTRACT(YEAR FROM p.date_created) as año,
    SUBSTR(p.code,3) as numero_emision,
    pt.state_name as estado_expediente,
    concat_ws(' ', ad.name, ad.last_name_1, ad.last_name_2) as encargado_expediente,
    p.document as documento
    from postulant ps 
    left join specialty sp on sp.id = ps.specialty_id
    left join faculty f on sp.faculty_id = f.id
    left join process p on p.postulant_id = ps.id
    left join process_state pt on p.state_process = pt.idprocess_state
    left join administrator ad on p.administrator_id = ad.id
    where p.code = `+ id;
    console.log(q);
    const process = await sequelizeDB.query(q);
    //res.send(process[0]);
    try {
        console.log("Renderizando");
        res.render("constancy/derivedConstancy",{data: process[0]});

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ error: error.stack });
    }*/
  res.send(200);
};

ConstancyProcessController.filterProcess = async (req, res) => {
  const name = req.body.name;
  const lastnamePatern = req.body.lastnamePatern;
  const lastnameMatern = req.body.lastnameMatern;
  const dni = req.body.dni;
  const number_doc = req.body.number_doc;
  //const date = req.body.date;
  const id_faculty = req.body.id_faculty;
  const id_specialty = req.body.id_specialty;

  console.log("name: "+name);
  console.log("lastnameP: "+lastnamePatern);
  console.log("lastnameM: "+lastnameMatern);
  console.log("dni: "+dni);
  console.log("number_doc: "+number_doc);
  console.log("facultad: "+id_faculty);
  console.log("especialidad: "+id_specialty);

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
    ON p.state_process = pst.idprocess_state where p.state_process = '4' `;

  if (name != null && name != "null") {
    q = q + ` and ps.name = ` + "'" + name + "'";
  }
  if (lastnamePatern != null) {
    q = q + ` and ps.last_name_1 = ` + "'" + lastnamePatern + "'";
  }
  if (lastnameMatern != null) {
    q = q + ` and ps.last_name_2 = ` + "'" + lastnameMatern + "'";
  }
  if (dni != null) {
    q = q + ` and ps.dni = ` + "'" + dni + "'";
  }
  if (number_doc != null) {
    q = q + ` and p.code = ` + "'" + number_doc + "'";
  }
  if (id_faculty != null) {
    q = q + ` and f.id = ` + "'" + id_faculty + "'";
  }
  if (id_specialty != null) {
    q = q + ` and sp.id = ` + "'" + id_specialty + "'";
  }
  console.log(q);
  const process = await sequelizeDB.query(q);
  res.send(process[0]);
};

ConstancyProcessController.getRequestInProcessList = async (req, res) => {
  try {
    const q = `SELECT 
		p.code as codigoSolicitud,
		p.state_process as estadoSolicitud,		pst.state_name as nombreEstadoSolicitud,  p.date_created as fechaSolicitud,
		c.name as nombreConstancia,
		ps.name as nombre, ps.last_name_1 as apellidoPaterno, 
		ps.last_name_2 as apellidoMaterno,concat_ws(' ', ps.name, ps.last_name_1, ps.last_name_2) as nombreCompleto,  
		ps.postulant_code as codigoPostulante,ps.dni as numeroDocumento,
		sp.name as escuelaAcademica,sp.initials as escuelaIniciales,
		f.name as facultad,f.initials as facultadIniciales
		FROM process p LEFT JOIN postulant ps 
		ON p.postulant_id = ps.id 
		LEFT JOIN constancy c ON p.constancy_id = c.id
		LEFT JOIN specialty sp ON ps.specialty_id = sp.id
		LEFT JOIN faculty f ON sp.faculty_id = f.id
		LEFT JOIN process_state pst
        ON p.state_process = pst.idprocess_state
        where p.state_process = 4`;

    const process = await sequelizeDB.query(q);
    res.send(process[0]);
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ error: error.stack });
  }
};

ConstancyProcessController.updateProcessConstancy = async (req, res) => {
  //

  try {
    const idConstancia = req.body.id;
    const tipo_documento = req.body;
    const asunto = req.body;
    let q =
      `
UPDATE PROCESS SET DOCUMENT_CATEGORY = ` +
      tipo_documento +
      `AND DOCUMENT_DESCRIPTION= ` +
      asunto +
      `
WHERE code=` +
      idConstancia;

    console.log(req.body);

    const process = await sequelizeDB.query(q);
  } catch (error) {
    return res.status(500).json({ error: error.stack });
  }
};
//Información de solicitud en proceso
ConstancyProcessController.getReviewInProcessInfo = async (req, res) => {
  try {
    res.render("constancy/generateConstancy");
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ error: error.stack });
  }
};

//Lista de solicitudes En Proceso
ConstancyProcessController.getRequestInProcess = async (req, res) => {
  try {
    res.render("constancy/requestInProcess");
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ error: error.stack });
  }
};

module.exports = ConstancyProcessController;
