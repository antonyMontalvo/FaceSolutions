const bcrypt = require("bcryptjs"),
    {Storage} = require("@google-cloud/storage"),
    fs = require("fs"),
    path = require("path"),
    moment = require("moment");

const Postulant = require("../models/postulant"),
    Department = require("../models/department"),
    Process = require("../models/process"),
    Province = require("../models/province"),
    District = require("../models/district"),
    Faculty = require("../models/faculty"),
    Specialty = require("../models/specialty"),
    Photo = require("../models/photo"),
    {createToken, getPayload} = require("../services/jwt"),
    bucketName = process.env.GCP_BUCKET_IMAGES,
    PostulantController = {},
    saltRounds = 10;

const gc = new Storage({
    keyFilename: path.join(__dirname, `${process.env.GCP_KEY_FILE}`),
    projectId: `${process.env.GCP_PROJECT_ID}`,
});

// Views
PostulantController.getIndex = async (req, res) => {
    try {
        return res.render("postulant/index");
    } catch (error) {
        console.log(error);
        // return res.status(500).json({error: error});
        return res.render('errors/500', {layout: null,});
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
        return res.render('errors/500', {layout: null,});
    }
};

PostulantController.loginView = async (req, res) => {
    try {
        return res.render("login", {layout: null});
    } catch (error) {
        console.log(error);
        return res.render('errors/500', {layout: null,});
    }
};

PostulantController.registerView = async (req, res) => {
    try {
        const departments = await Department.findAll({raw: true, order: [['name', 'ASC']]});
        const provinces = JSON.stringify(await Province.findAll({raw: true, order: [['name', 'ASC']]}));
        const districts = JSON.stringify(await District.findAll({raw: true, order: [['name', 'ASC']]}));

        const faculties = await Faculty.findAll({raw: true, order: [['code', 'ASC']]});
        const specialties = JSON.stringify(await Specialty.findAll({raw: true, order: [['code', 'ASC']]}));

        return res.render("registro", {
            layout: null,
            data: {departments, provinces, districts, faculties, specialties},
        });
    } catch (error) {
        console.log(error);
        return res.render('errors/500', {layout: null,});
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
        return res.render('errors/500', {layout: null,});
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
        return res.render('errors/500', {layout: null,});
    }
};

PostulantController.profile = async (req, res) => {
    try {
        const proccess = await Process.findOne({where: {postulant_id: req.session.usuario.id}, raw: true});
        console.log(proccess)
        return res.render("postulant/profile", {
            layout: 'main',
            data: {
                postulant: req.session.usuario,
                date: moment(Date.now()).format('DD/MM/YYYY'),
                process: proccess ? true : false
            }
        });
    } catch (error) {
        console.log(error);
        return res.render('errors/500', {layout: null,});
    }
};

PostulantController.message = async (req, res) => {
    try {
        res.render("postulant/message");
    } catch (error) {
        console.log(error);
        return res.render('errors/500', {layout: null,});
    }
};

PostulantController.correccion = async (req, res) => {
    try {
        res.render("postulant/tramitesCorreccion");
    } catch (error) {
        console.log(error);
        return res.render('errors/500', {layout: null,});
    }
};
PostulantController.correccionDocumento = async (req, res) => {
    try {
        res.render("postulant/tramitesCorreccionDoc");
    } catch (error) {
        console.log(error);
        return res.render('errors/500', {layout: null,});
    }
};
PostulantController.rechazados = async (req, res) => {
    try {
        res.render("postulant/tramitesRechazados");
    } catch (error) {
        console.log(error);
        return res.render('errors/500', {layout: null,});
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
        return res.render('errors/500', {layout: null,});
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
        return res.render('errors/500', {layout: null,});
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
        return res.render('errors/500', {layout: null,});
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
                destination: `${folder}_${i + 1}.jpg`,
                gzip: true,
                metadata: {
                    cacheControl: 'public, max-age=31536000',
                },
            })
            photos.push({
                name: files[i].originalname,
                path: `https://storage.googleapis.com/${bucketName}/${folder}_${i + 1}.jpg`,
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

PostulantController.updatePhoto = async (req, res) => {
    try {
        const {idPhoto} = req.body;

        const file = req.file;

        const photo = await Photo.findByPk(idPhoto);
        const postulant = await Postulant.findByPk(photo.idpostulant);
        const folder = `_${postulant.dni}_${postulant.postulant_code}`;
        const dir = path.join(
            __dirname,
            `../public/perfiles/${folder}`
        );

        if (fs.existsSync(dir)) {
            await gc.bucket(bucketName).upload(file.path, {
                destination: `${folder}_${photo.name}`,
                gzip: true,
                metadata: {
                    cacheControl: 'public, max-age=31536000',
                },
            })
            await Photo.update({
                state: 3,
            }, {where: {idpost_req: idPhoto}});
            await fs.renameSync(file.path, path.join(dir, `${photo.name}`));
        }

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
        return res.render('errors/500', {layout: null,});
    }
};

PostulantController.logout = async (req, res) => {
    try {
        req.session.usuario = null;
        req.session.token = null;
        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        return res.render('errors/500', {layout: null,});
    }
};

module.exports = PostulantController;
