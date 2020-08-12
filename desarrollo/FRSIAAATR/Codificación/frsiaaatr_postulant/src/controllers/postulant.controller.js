const bcrypt = require("bcryptjs");

const Postulant = require("../models/postulant"),
{createToken, getPayload} = require("../services/jwt"),
EmployeesController = {},
saltRounds = 10;


// CArlos****
const  path = require("path"),
multer = require("multer"),
fs = require("fs");
// const { LABELED_IMAGES_URL, TEMP_UPLOAD_FOR_LOGIN_URL, LOGIN_IMG_NAME, PORT } = require ('../constantes/constants');
const nomb="7945";
const LABELED_IMAGES_URL = path.join(__dirname, '/../public/perfiles');
const multiStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `${LABELED_IMAGES_URL}/${nomb}`;
    !fs.existsSync(dir) ? fs.mkdirSync(dir) : null;
    cb(null, path.join(dir))
  },
  filename: (req, file, cb) => cb(null, file.originalname)
})

const upload = multer({ storage: multiStorage })
// ---------------------

// app.post('/register', uploadMultiple.array('image'), async (req, res) => {
  // load();
  // return res.send({ label: nomb });
// })
// 
EmployeesController.login = async (req, res) => {
  try {
    
    res.render("login", {layout: null});
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({error: error.stack});
  }
}

EmployeesController.home = async (req, res) => {
  try {
    const postulants = await Postulant.findAll();
    console.log(postulants);

    res.render("index", {layout: "main"});
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({error: error.stack});
  }
}

EmployeesController.registrando = async (req, res) => {
  try{
        // console.log(nomb," :o");
        console.log("Entro a registro de controller");
        upload(req, res, err => {
          if (err) {
           return res.status(500).json({error: error.stack});
         }
         return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename })
       })

        // return res.send({ label: nomb });
      }catch(error){
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
      }
    }

    EmployeesController.registro = async (req, res) => {
     try {

      return res.render("registro", {layout: null});
    } catch (error) {
      console.log(error.stack);
      return res.status(500).json({error: error.stack});
    }
  }

  module.exports = EmployeesController;
