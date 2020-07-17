const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("admin/index");
});
router.get("/login", (req, res) => {
  res.render("prueba",{layout:"login"});
});
router.get("/registro", (req, res) => {
  res.render("prueba",{layout:"registro"});
});

module.exports = router;
