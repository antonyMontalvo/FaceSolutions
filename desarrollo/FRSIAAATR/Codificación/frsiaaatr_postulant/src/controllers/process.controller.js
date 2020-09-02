const bcrypt = require("bcryptjs"),
    {Storage} = require("@google-cloud/storage"),
    fs = require("fs"),
    path = require("path"),
    moment = require("moment"),
    {Op} = require("sequelize");

const Postulant = require("../models/postulant"),
    Process = require("../models/process"),
    Requirement = require("../models/requirement"),
    Photo = require("../models/photo"),
    ProcessState = require("../models/processState"),
    {createToken, getPayload} = require("../services/jwt"),
    bucketName = process.env.GCP_BUCKET_NAME,
    ProcessController = {},
    saltRounds = 10;

let _requirements = [
    {
        name: 'Acta de notas de secundaria',
        state_requirement: 1,
    },
    {
        name: 'Comprobante de orden de merito',
        state_requirement: 1,
    },
    {
        name: 'Voucher de Pago',
        state_requirement: 1,
    }, {
        name: 'Acta de nacimiento',
        state_requirement: 1,
    },
]
const gc = new Storage({
    keyFilename: path.join(__dirname, `${process.env.GCP_KEY_FILE}`),
    projectId: `${process.env.GCP_PROJECT_ID}`,
});

// Views
ProcessController.newRequirements = async (req, res) => {
    try {
        let process = await Process.findAll({
            nest: true,
            raw: true,
            include: [{as: 'state', model: ProcessState}],
            where: {postulant_id: req.session.usuario.id, state_process: 1}
        });
        console.log(process)
        return res.render("postulant/tramitesNuevos", {layout: 'main', data: {process}});
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};
ProcessController.correccion = async (req, res) => {
    try {
        let process = await Process.findAll({
            nest: true,
            raw: true,
            include: [{as: 'state', model: ProcessState}],
            where: {
                postulant_id: req.session.usuario.id, state_process: {
                    [Op.not]: 1
                }
            }
        });
        console.log(process)
        return res.render("postulant/tramitesCorreccion", {layout: 'main', data: {process}});
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};
ProcessController.correccionDocumento = async (req, res) => {
    try {
        let {id} = req.params;
        let requirements = await Requirement.findAll({raw: true, where: {process_id: id}})

        res.render("postulant/tramitesCorreccionDoc", {layout: 'main', data: {requirements}});
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};

ProcessController.rechazados = async (req, res) => {
    try {
        let process = await Process.findAll({
            nest: true,
            raw: true,
            include: [{as: 'state', model: ProcessState}],
            where: {postulant_id: req.session.usuario.id, state_process: 5}
        });
        res.render("postulant/tramitesRechazados", {layout: 'main', data: {process}});
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};

ProcessController.getById = async (req, res) => {
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

/**
 * Logic
 */
ProcessController.create = async (req, res) => {
    try {
        const proGlobal = await Process.findAll();
        const pro = await Process.findAll({where: {postulant_id: req.session.usuario.id,}});
        if (pro.length == 0) {
            const process = await Process.create({
                code: `0000${proGlobal.length + 1}`,
                state_process: 1,
                administrator_id: 1,
                postulant_id: req.session.usuario.id,
            })
            for (let i = 0; i < _requirements.length; i++) {
                _requirements[i].process_id = process.null;
            }
            const requirements = await Requirement.bulkCreate(_requirements);
        }

        return res.redirect("/documents/TramitesNuevos");
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};

ProcessController.updateRequirement = async (req, res) => {
    try {
        const files = req.files;
        const {data} = req.body;
        const realData = JSON.parse(data);

        for (let i = 0; i < realData.length; i++) {
            const indexFile = files.findIndex(f => f.filename == realData[i].filename);
            if (indexFile > -1) {
                let oficialName = `${Date.now().toString()}_${realData[i].filename}`;
                await gc.bucket(bucketName).upload(files[indexFile].path, {
                    destination: oficialName,
                    gzip: true,
                    metadata: {
                        cacheControl: 'public, max-age=31536000',
                    },
                })
                const req = await Requirement.findByPk(realData[i].id, {raw: true});
                let reqDate = {path: `https://storage.googleapis.com/${bucketName}/${oficialName}`,}
                if (req.state_requirement == 2) reqDate.state_requirement = 3;
                await Requirement.update(reqDate, {where: {idrequirement: realData[i].id}});
            }
        }

        return res.status(200).json({message: true});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message: false});
    }
};


ProcessController.login = async (req, res) => {
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

ProcessController.loginCamera = async (req, res) => {
    try {
        const {id} = req.body;
        const postulantFound = await Postulant.findByPk(Number(id), {raw: true});

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

ProcessController.register = async (req, res) => {
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

ProcessController.registerPhotos = async (req, res) => {
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
        for (let i = 1; i <= files.length; i++) {
            await gc.bucket(bucketName).upload(files[i].path, {
                destination: `${folder}_${i}.jpg`,
                gzip: true,
                metadata: {
                    cacheControl: 'public, max-age=31536000',
                },
            })
            photos.push({
                filename: files[i].originalname,
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

ProcessController.checkPhoto = async (req, res) => {
    try {
        return res.status(200).send({message: true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error});
    }
};

ProcessController.update = async (req, res) => {
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

ProcessController.logout = async (req, res) => {
    try {
        req.session.usuario = null;
        req.session.token = null;
        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        return res.render('errors/500');
    }
};

module.exports = ProcessController;
