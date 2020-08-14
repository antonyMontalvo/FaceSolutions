const bcrypt = require("bcryptjs"),
    fs = require("fs"),
    path = require("path");

const Postulant = require("../models/postulant"),
    Department = require("../models/department"),
    Province = require("../models/province"),
    District = require("../models/district"),
    Photo = require("../models/photo"),
    {createToken, getPayload} = require("../services/jwt"),
    PostulantController = {},
    saltRounds = 10;

// Views
PostulantController.getIndex = async (req, res) => {
    try {
        res.render("postulant/index");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

PostulantController.loginView = async (req, res) => {
    try {
        res.render("login", {layout: null});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

PostulantController.registerView = async (req, res) => {
    try {
        const departments = await Department.findAll({raw: true});
        const provinces = JSON.stringify(await Province.findAll({raw: true}));
        const districts = JSON.stringify(await District.findAll({raw: true}));

        res.render("registro", {layout: null, data: {departments, provinces, districts}});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};
PostulantController.prueba = async (req, res) => {
    res.render("prueba", {layout: "postulantelogin"});
}

PostulantController.getRegistrePhoto = async (req, res) => {
    try {
        const postulant = await Postulant.findByPk(3);
        res.render("registroFotos", {layout: null, data: {id: postulant.id}});
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: error.stack});
    }
};

// Logic
PostulantController.login = async (req, res) => {
    try {
        const {dni, postulant_code} = req.body;
        const postulantFound = await Postulant.findOne({
                where: {dni, postulant_code}
            }
        );

        if (postulantFound) {
            const code = String("_" + dni + "_" + postulant_code);
            res.render("prueba", {layout: "postulantelogin", data: {code}});
        } else
            res.render("login", {layout: null});

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

PostulantController.loginCamera = async (req, res) => {
    try {
        const {dni, postulant_code, state} = req.body;
        const postulantFound = await Postulant.findOne({
                where: {dni, postulant_code}
            }
        );

        if (postulantFound && state) {
            req.session.usuario = postulantFound.name;
            req.session.token = createToken(postulantFound);
            res.render("prueba", {layout: "postulantelogin", data: {}});
        } else {
            res.redirect("/");
        }

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

PostulantController.register = async (req, res) => {
    try {
        const body = req.body;
        const postulanteFormat = {
            ...body,
            state: 1,
            acepted_state: 0
        }
        const postulant = await Postulant.create(postulanteFormat);

        let message = null;
        if (!postulant) {
            message = postulant;
            console.log(message)
            res.render("registro", {layout: null, data: {message}});
        } else {
            res.render("registroFotos", {layout: null, data: {id: postulant.null}});
        }

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

PostulantController.registerPhotos = async (req, res) => {
    try {
        const {id} = req.body;
        console.log(req.body)
        const files = req.files;
        const postulant = await Postulant.findByPk(id);

        const dir = path.join(__dirname, `../public/perfiles/_${postulant.dni}_${postulant.postulant_code}`);
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, {recursive: true});

        let photos = [];
        for (let i = 0; i < files.length; i++) {
            photos.push({
                filename: files[i].originalname,
                state: 1,
                postulant_id: id
            })
            fs.renameSync(files[i].path, path.join(dir, `${files[i].originalname}`));
        }

        await Photo.bulkCreate(photos);

        return res.status(200).send({message: true});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

PostulantController.checkPhoto = async (req, res) => {
    try {
        return res.status(200).send({message: true});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
}

PostulantController.profile = async (req, res) => {
    try {
        res.render("postulant/profile");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};

PostulantController.correccion = async (req, res) => {
    try {
        res.render("postulant/tramitesCorreccion");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};
PostulantController.rechazados = async (req, res) => {
    try {
        res.render("postulant/tramitesRechazados");
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({error: error.stack});
    }
};


module.exports = PostulantController;
