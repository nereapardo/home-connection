const router = require("express").Router();
const bcrypt = require("bcryptjs");
const House = require("../models/House.model");
const User = require("../models/User.model");
const { isLoggedOut } = require("../middleware/route-guard");
const { isLoggedIn } = require("../middleware/route-guard");

router.get("/signup", (req, res, next) => {
  res.render("signup");
});
router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("login");
});
router.post("/signup", isLoggedOut, async (req, res, next) => {
  const { username, password, contact } = req.body;
  if (!username || !password) {
    return res.render("createUser", {
      msg: "You need to enter a valid username, password and contact information",
    });
  }
  const userFromDB = await User.findOne({ username });
  if (userFromDB) {
    return res.render("signup", {
      msg: "This username already exists",
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      username,
      password: hashedPassword,
      contact,
    });
    res.redirect("/for-rent");
  } catch (error) {
    res.render("signup", { msg: "You must enter all the info" });
  }
});
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("login", { errorMsg: "You need to fill all inputs" });
  }
  const userFromDB = await User.findOne({ username });
  if (!userFromDB) {
    res.render("login", { errorMsg: "The user does not exist" });
  } else {
    const passwordMatch = await bcrypt.compare(password, userFromDB.password);
    if (!passwordMatch) {
      res.render("login", { errorMsg: "Incorrect password" });
    } else {
      req.session.loggedUser = userFromDB;
      res.redirect("/");
    }
  }
});
router.post("/logout", isLoggedIn, async (req, res, next) => {
  res.clearCookie("connect.sid", { path: "/" });

  try {
    await req.session.destroy();
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
