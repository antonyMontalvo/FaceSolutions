const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("statistics/index");
});

module.exports = router;
