// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");
const path = require("path");
const multer = require("multer");
hbs.registerHelper("spaceToLowBAR", function (str) {
  return str.replace(/\s+/g, "_");
});

const app = express();
require("./config/session.config")(app);

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const projectName = "basic-auth";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

const storage = multer.diskStorage({
  destination: path.join(__dirname, "/userImages"),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});
app.use(multer({ storage }).single("photo"));

app.use((req, res, next) => {
  if (req.session.loggedUser) {
    res.locals.session = req.session;
  }
  next();
});

// 👇 Start handling routes here
app.use("/", require("./routes/index"));
app.use("/", require("./routes/house.routes"));
app.use("/", require("./routes/auth.routes"));
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

// Middleware to send login session to navbar in layout

module.exports = app;
