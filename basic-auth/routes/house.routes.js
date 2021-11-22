const router = require("express").Router();
const House = require("../models/House.model");
const fileUploader = require("../config/cloudinary.config");
const { isLoggedOut } = require("../middleware/route-guard");
const { isLoggedIn } = require("../middleware/route-guard");

router.get("/new-house", isLoggedIn, (req, res, next) => {
  const { username } = req.session.loggedUser;
  res.render("newHouse");
});
router.get("/for-rent", (req, res, next) => {
  res.render("forRent");
});
router.post("/new-house", async (req, res, next) => {
  const { title, location, area, rooms, description, price } = req.body;
  let active = req.body.active === "on" ? true : false;
  console.log(req.file);
  try {
    const createdHouse = await House.create({
      title,
      location,
      area,
      rooms,
      photo: req.file.path,
      description,
      price,
      active,
    });
    console.log(createdHouse);
    res.redirect("/for-rent");
  } catch (error) {
    res.render("newHouse", { msg: "You must enter all the info" });
  }
});

module.exports = router;
