const router = require("express").Router();
const bcrypt = require("bcryptjs");
const House = require("../models/House.model");
const User = require("../models/User.model");
const { isLoggedOut } = require("../middleware/route-guard");
const { isLoggedIn } = require("../middleware/route-guard");

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("signup");
});
router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("login");
});
router.get("/profile", async (req, res, next) => {
  try {
    const userId = await req.session.loggedUser._id;
    const query = { userId: userId };
    const userHouses = await House.find(query);
    const user = await User.findById(userId);
    res.render("profile", { user, userHouses });
  } catch (error) {
    console.log(error);
  }
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
    res.redirect("/login");
  } catch (error) {
    res.render("signup", { msg: "You must enter all the info" });
  }
});
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("login", { msg: "You need to fill all inputs" });
    return;
  }
  const userFromDB = await User.findOne({ username });
  if (!userFromDB) {
    res.render("login", { msg: "Invalid credentials" });
    return;
  } else {
    const passwordMatch = await bcrypt.compare(password, userFromDB.password);
    if (!passwordMatch) {
      res.render("login", { msg: "Invalid credentials" });
    } else {
      req.session.loggedUser = userFromDB;
      res.redirect("/profile");
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
