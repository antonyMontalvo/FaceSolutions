const router = require("express").Router();

const adminController = require("../controllers/admin.controller"),
    validator = require("../middlewares/validation"),
    authenticate = require("../middlewares/authenticate");

router.get("/", adminController.getIndex);
router.get("/login", adminController.getLogin);
router.get("/register", adminController.getRegister);


router.get("/facial", (req, res) => {
  res.render("prueba",{layout:"postulantelogin"});
});
router.post("/api",(req, res) => {
  console.log("api face");
});

module.exports = router;
