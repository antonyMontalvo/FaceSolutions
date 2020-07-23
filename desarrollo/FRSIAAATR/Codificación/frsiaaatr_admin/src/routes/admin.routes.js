const router = require("express").Router();

const adminController = require("../controllers/admin.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate");

router.get("/", adminController.getIndex);
router.get("/login", adminController.getLogin);
router.get("/register", adminController.getRegister);

module.exports = router;
