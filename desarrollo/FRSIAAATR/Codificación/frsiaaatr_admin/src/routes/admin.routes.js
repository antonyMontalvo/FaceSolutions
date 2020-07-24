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


router.get("/facial", (req, res) => {
  res.render("prueba",{layout:"postulantelogin"});
});
router.post("/api",(req, res) => {
  console.log("api face");
});

module.exports = router;
