const bcrypt = require("bcryptjs"),
    {Storage} = require("@google-cloud/storage"),
    fs = require("fs"),
    path = require("path"),
    moment = require("moment");

const Postulant = require("../models/postulant"),
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> master
    Department = require("../models/department"),
    Province = require("../models/province"),
    District = require("../models/district"),
    Faculty = require("../models/faculty"),
    Specialty = require("../models/specialty"),
    Photo = require("../models/photo"),
    {createToken, getPayload} = require("../services/jwt"),
<<<<<<< HEAD
<<<<<<< HEAD
    PostulantController = {},
    saltRounds = 10;
=======
  Department = require("../models/department"),
  Province = require("../models/province"),
  District = require("../models/district"),
  Photo = require("../models/photo"),
  { createToken, getPayload } = require("../services/jwt"),
  PostulantController = {},
  saltRounds = 10;
>>>>>>> master
=======
    bucketName = process.env.GCP_BUCKET_NAME,
=======
    bucketName = process.env.GCP_BUCKET_IMAGES,
>>>>>>> master
    PostulantController = {},
    saltRounds = 10;

const gc = new Storage({
    keyFilename: path.join(__dirname, `${process.env.GCP_KEY_FILE}`),
    projectId: `${process.env.GCP_PROJECT_ID}`,
});
>>>>>>> master

// Views
PostulantController.getIndex = async (req, res) => {
    try {
        return res.render("postulant/index");
    } catch (error) {
        console.log(error);
        // return res.status(500).json({error: error});
        return res.render('errors/500');
    }
};

PostulantController.information = async (req, res) => {
    try {
        const photos = await Photo.findAll({
            raw: true,
            where: {idpostulant: req.session.usuario.id}
        })
        return res.render("postulant/Information", {
            layout: 'main',
            data: {usuario: req.session.usuario, photos}
        });
    } catch (error) {
        console.log(error);
        // return res.status(500).json({error: error});
        return res.render('errors/500');
    }
};

PostulantController.loginView = async (req, res) => {
<<<<<<< HEAD
<<<<<<< HEAD
    try {
        res.render("login", {layout: null});
    } catch (error) {
>>>>>>> master
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
      }
    }
=======
  try {
    res.render("login", { layout: null });
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ error: error.stack });
  }
=======
    try {
        return res.render("login", {layout: null});
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
>>>>>>> master
};
>>>>>>> master

    EmployeesController.registro = async (req, res) => {
     try {

      return res.render("registro", {layout: null});
    } catch (error) {
      console.log(error.stack);
      return res.status(500).json({error: error.stack});
    }
  }

<<<<<<< HEAD
  module.exports = EmployeesController;
=======
PostulantController.registerView = async (req, res) => {
    try {
        const departments = await Department.findAll({raw: true, order: [['name', 'ASC']]});
        const provinces = JSON.stringify(await Province.findAll({raw: true, order: [['name', 'ASC']]}));
        const districts = JSON.stringify(await District.findAll({raw: true, order: [['name', 'ASC']]}));

        return res.render("registro", {
            layout: null,
            data: {departments, provinces, districts},
        });
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};

PostulantController.prueba = async (req, res) => {
    res.render("postulantelogin", {layout: null});
};

PostulantController.getRegistrePhoto = async (req, res) => {
    try {
        const postulant = await Postulant.findByPk(3);
        res.render("registroFotos", {layout: null, data: {id: postulant.id}});
    } catch (err) {
        console.error(err);
        return res.render('errors/500');
    }
};

PostulantController.getById = async (req, res) => {
    try {
        const {id} = req.body;
        const postulant = await Department.findByPk(id, {raw: true});

        return res.render("", {
            layout: "main",
            data: {postulant},
        });
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};

PostulantController.profile = async (req, res) => {
    try {
        console.log(req.session)
        res.render("postulant/profile", {
            layout: 'main',
            data: {postulant: req.session.usuario, date: moment(Date.now()).format('DD/MM/YYYY')}
        });
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};

PostulantController.message = async (req, res) => {
    try {
        res.render("postulant/message");
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};

PostulantController.correccion = async (req, res) => {
    try {
        res.render("postulant/tramitesCorreccion");
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};
PostulantController.correccionDocumento = async (req, res) => {
    try {
        res.render("postulant/tramitesCorreccionDoc");
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};
PostulantController.rechazados = async (req, res) => {
    try {
        res.render("postulant/tramitesRechazados");
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};

/**
 * Logic
 */


PostulantController.login = async (req, res) => {
    try {
        const {dni, postulant_code} = req.body;
        const postulantFound = await Postulant.findOne({
            where: {dni, postulant_code},
        });

        if (postulantFound) {
            const photos = await Photo.findAll({where: {idpostulant: postulantFound.id}});
            if (photos.length > 0) {
                const code = String("_" + dni + "_" + postulant_code);

                return res.render("postulantelogin", {
                    layout: null,
                    data: {id: postulantFound.id, code, photos: photos.length}
                });
            } else {
                return res.render("registroFotos", {
                    layout: null,
                    data: {
                        id: postulantFound.id,
                        message: 'No cuenta con fotos registradas por favor ingreselas'
                    },
                });
            }
        } else res.redirect("/login");
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};

PostulantController.loginCamera = async (req, res) => {
    try {
        const {id} = req.body;
        const postulantFound = await Postulant.findByPk(Number(id), {
            nest: true,
            raw: true, include: [
                {
                    as: "specialty",
                    model: Specialty,
                    include: [
                        {
                            as: "faculty",
                            model: Faculty
                        }
                    ]
                }
            ]
        });

        if (postulantFound) {
            req.session.usuario = postulantFound;
            req.session.token = createToken(postulantFound);
        }

        return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};

PostulantController.register = async (req, res) => {
    try {
        const body = req.body;
        const postulantFormat = {
            ...body,
            state: 1,
            acepted_state: 0,
        };
        const postulant = await Postulant.create(postulantFormat);

        let message = null;
        if (!postulant) {
            message = postulant;
            console.log(message);
            res.render("registro", {layout: null, data: {message}});
        } else {
            res.render("registroFotos", {
                layout: null,
                data: {id: postulant.null},
            });
        }
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};

PostulantController.registerPhotos = async (req, res) => {
    try {
        const {id} = req.body;

        const files = req.files;
        const postulant = await Postulant.findByPk(id);
        const folder = `_${postulant.dni}_${postulant.postulant_code}`;
        const dir = path.join(
            __dirname,
            `../public/perfiles/${folder}`
        );

        if (!fs.existsSync(dir)) {
            await fs.mkdirSync(dir, {recursive: true});
        }

        let photos = [];
        for (let i = 0; i < files.length; i++) {
            await gc.bucket(bucketName).upload(files[i].path, {
                destination: `${folder}_${i+1}.jpg`,
                gzip: true,
                metadata: {
                    cacheControl: 'public, max-age=31536000',
                },
            })
            photos.push({
                name: files[i].originalname,
                path: `https://storage.googleapis.com/${bucketName}/${folder}_${i+1}.jpg`,
                state: 1,
                idpostulant: id,
            });
            await fs.renameSync(files[i].path, path.join(dir, `${files[i].originalname}`));
        }

        await Photo.bulkCreate(photos);

        return res.status(200).json({message: true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error});
    }
};

PostulantController.checkPhoto = async (req, res) => {
    try {
        return res.status(200).send({message: true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error});
    }
};

PostulantController.update = async (req, res) => {
    try {
        const {id} = req.params;
        const body = req.body;
        const postulant = await Department.update({
            ...body,
            acepted_state: 0
        }, {where: {id}});

        if (!postulant) {
            return res.render("", {
                layout: "main",
                data: {postulant},
            });
        }
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};

PostulantController.logout = async (req, res) => {
    try {
        req.session.usuario = null;
        req.session.token = null;
        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};

module.exports = PostulantController;
>>>>>>> master
