const router = require("express").Router();
const House = require("../models/House.model");
const fileUploader = require("../config/cloudinary.config");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
