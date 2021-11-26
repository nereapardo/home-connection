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

function capitalize(str) {
  const splitStr = str.toLowerCase().split(" ");
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

router.get("/new-house", isLoggedIn, (req, res, next) => {
  const { username } = req.session.loggedUser;
  res.render("newHouse");
});
router.get("/for-rent", async (req, res, next) => {
  try {
    const housesList = await House.find();
    let locationList = [""];
    housesList.forEach((house) => {
      if (locationList.includes(house.location)) return;
      locationList.push(house.location);
      return locationList;
    });
    res.render("forRent", { housesList, locationList });
  } catch (error) {
    console.log(error);
  }
});
router.get("/for-rent/search", async (req, res, next) => {
  if (req.url === `/for-rent/search?location=`) {
    res.redirect("/for-rent");
    return;
  }
  const housesList = await House.find(req.query);
  const currentSearchValue = req.query.location.toString();
  const allHousesList = await House.find();
  let locationList = [""];
  allHousesList.forEach((house) => {
    if (locationList.includes(house.location)) return;
    locationList.push(house.location);
    return locationList;
  });
  res.render("forRent", { housesList, locationList, currentSearchValue });
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
router.get("/house/:id/update", isLoggedIn, async (req, res, next) => {
  const loggedUserId = await req.session.loggedUser._id;
  const houseInfo = await House.findById(req.params.id);
  const houseManager = houseInfo.userId.toString();
  if (loggedUserId !== houseManager) {
    res.redirect("/");
    return;
  }
  try {
    res.render("updateHouse", { houseInfo });
  } catch (error) {
    res.render("updateHouse", { msg: "THERE WAS AN ERROR" });
  }
});
router.post("/new-house", isLoggedIn, async (req, res, next) => {
  const { title, area, rooms, description, price } = req.body;
  const location = capitalize(req.body.location);
  let active = req.body.active === "on" ? true : false;
  let photo = "/images/no-img-available.jpg";
  let public_id = "";
  if (req.file !== undefined) {
    const photoUploaded = await cloudinary.v2.uploader.upload(req.file.path);
    photo = photoUploaded.url;
    public_id = photoUploaded.public_id;
  }
  const userId = await req.session.loggedUser._id;
  let msg = "Fields m2, rooms and price must be numbers";
  // const regex = /^[a-zA-Z]+$/;
  // if (
  //   !{ area }.match(regex) ||
  //   !{ rooms }.match(regex) ||
  //   !{ price }.match(regex)
  // ) {
  //   res.render("newHouse", { msg });
  // }
  try {
    msg = "You must enter all the info";
    const createdHouse = await House.create({
      title,
      location,
      area,
      rooms,
      photo,
      public_id,
      description,
      price,
      active,
      userId,
    });
    res.redirect("/profile");
  } catch (error) {
    res.render("newHouse", { msg });
  }
});
router.post("/house/:id/update", isLoggedIn, async (req, res, next) => {
  const loggedUserId = await req.session.loggedUser._id;
  const houseInfo = await House.findById(req.params.id);
  const houseManager = houseInfo.userId.toString();
  if (loggedUserId !== houseManager) {
    res.redirect("/");
    return;
  }
  const housePhoto = houseInfo.public_id;
  if (housePhoto !== "") {
    const result = await cloudinary.v2.uploader.destroy(housePhoto);
  }
  const { title, location, area, rooms, description, price } = req.body;
  let active = req.body.active === "on" ? true : false;
  let photo = "/images/no-img-available.jpg";
  let public_id = "";
  if (req.file !== undefined) {
    const photoUploaded = await cloudinary.v2.uploader.upload(req.file.path);
    photo = photoUploaded.url;
    public_id = photoUploaded.public_id;
  }
  try {
    const updatedHouse = await House.findByIdAndUpdate(req.params.id, {
      title,
      location,
      area,
      rooms,
      photo,
      public_id,
      description,
      price,
      active,
    });
    res.redirect("/profile");
  } catch (error) {
    res.render("updateHouse", {
      houseInfo,
      msg: "there was an error",
    });
  }
});
router.post("/house/:id/delete", isLoggedIn, async (req, res, next) => {
  const loggedUserId = await req.session.loggedUser._id;
  const houseInfo = await House.findById(req.params.id);
  const houseManager = houseInfo.userId.toString();
  if (loggedUserId !== houseManager) {
    res.redirect("/");
    return;
  }
  const housePhoto = houseInfo.public_id;
  if (housePhoto !== "") {
    const result = await cloudinary.v2.uploader.destroy(housePhoto);
  }
  try {
    const deletedHouse = await House.findByIdAndRemove(req.params.id);
    res.redirect("/profile");
  } catch (error) {
    res.redirect("/profile");
  }
});
// TODO: add different filters
// Add a user page where there are a list of active and unactive houses and user can access to ech house and update and delete them
// TODO bonus: increase password security (longer password with special characters)

module.exports = router;
