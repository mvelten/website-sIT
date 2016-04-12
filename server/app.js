"use strict";

var _ = require("lodash");
var express = require("express");
var ehbs = require("express-handlebars");
var i18n = require("i18n");
var path = require("path");
var debugError = require("debug")("sIT:app:error");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var app = express();

const FRONTEND_PATH = path.join(__dirname, "..", "frontend");
const VIEWS_PATH = path.join(FRONTEND_PATH, "views");
const ROUTES = {
  "/": require("./routes/index"),
  "/current": require("./routes/current")
};

i18n.configure({
  locales: ["en", "de"],
  defaultLocale: "de",
  queryParameter: "lang",
  directory: FRONTEND_PATH + "/locales"
});

// view engine setup

var hbs = ehbs.create({
  defaultLayout: "main",
  layoutsDir: path.join(VIEWS_PATH, "layouts"),
  partialsDir: path.join(VIEWS_PATH, "partials"),
  extname: ".hbs",
  helpers: {
    i18n: function () { return this.__.apply(this, arguments); }
  }
});

app.engine("hbs", hbs.engine);
app.set("views", path.join(VIEWS_PATH, "content"));
app.set("view engine", "hbs");

app.use(favicon(path.join(FRONTEND_PATH, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(i18n.init);
app.use(require("less-middleware")(path.join(FRONTEND_PATH, "public")));
app.use(express.static(path.join(FRONTEND_PATH, "public")));

_.each(ROUTES, function (value, route) {
  app.use("/api/v1" + route, value.apiRouter);
  app.use("/api" + route, value.apiRouter);
  app.use(route, value.router);
});

// catch 404 and forward to error handler
app.use(function (req, res) {
  debugError("Route not found: %s", req.path);
  res.status(404).send("Not Found");
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});


module.exports = app;
