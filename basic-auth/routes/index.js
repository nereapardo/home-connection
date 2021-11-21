const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/newHouse", (req, res, next) => {
  res.render("newHouse");
});

module.exports = router;
