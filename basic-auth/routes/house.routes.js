const router = require("express").Router();
const House = require("../models/House.model");
const User = require("../models/User.model");
const { isLoggedOut } = require("../middleware/route-guard");
const { isLoggedIn } = require("../middleware/route-guard");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

router.get("/new-house", (req, res, next) => {
  const { username } = req.session.loggedUser;
  res.render("newHouse");
});
router.get("/for-rent", async (req, res, next) => {
  try {
    const housesList = await House.find();
    res.render("forRent", { housesList });
  } catch (error) {
    console.log(error);
  }
});
router.get("/house/:id", async (req, res, next) => {
  try {
    const houseInfo = await House.findById(req.params.id);
    const userInfo = await User.findById(houseInfo.userId);
    res.render("houseInfo", { houseInfo, userInfo });
  } catch (error) {
    console.log(error);
  }
});
router.post("/new-house", isLoggedIn, async (req, res, next) => {
  const { title, location, area, rooms, description, price } = req.body;
  let active = req.body.active === "on" ? true : false;
  const photo = await cloudinary.v2.uploader.upload(req.file.path);
  const userId = await req.session.loggedUser._id;
  try {
    const createdHouse = await House.create({
      title,
      location,
      area,
      rooms,
      photo: photo.url,
      public_id: photo.public_id,
      description,
      price,
      active,
      userId,
    });
    res.redirect("/for-rent");
  } catch (error) {
    res.render("newHouse", { msg: "You must enter all the info" });
  }
});
// TODO: add different filters
// Add a user page where there are a list of active and unactive houses and user can access to ech house and update and delete them
// TODO bonus: increase password security (longer password with special characters)

module.exports = router;
