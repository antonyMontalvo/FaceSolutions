const router = require("express").Router();

const adminController = require("../controllers/admin.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate"),
    { checkToken } = require("../middlewares/auth");

router.get("/", checkToken, adminController.getIndex);
router.get("/login", adminController.getLogin);
router.get("/register", adminController.getRegister);
router.post("/exec-login", adminController.loginAdmin);
router.post("/logout", adminController.logout);

module.exports = router;