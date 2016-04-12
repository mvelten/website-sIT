"use strict";

let _ = require("lodash");
let Promise = require("bluebird");
let express = require("express");
let ehbs = require("express-handlebars");
let i18n = require("i18n");
let path = require("path");
let debugError = require("debug")("sIT:app:error");
let favicon = require("serve-favicon");
let logger = require("morgan");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");

let app = express();

const __SLICE = Array.prototype.slice;
const DEBUG = !!process.env.DEBUG_SIT;
const FRONTEND_PATH = path.join(__dirname, "..", "frontend");
const VIEWS_PATH = path.join(FRONTEND_PATH, "views");
const LOCALES = ["en", "de"];
const DEFAULT_LOCALE = "de";
const ROUTES = {
  "/": require("./routes/index"),
  "/current": require("./routes/current"),
  "/archive": require("./routes/archive")
};

if (DEBUG) {
  Promise.config({
    warnings: true,
    longStackTraces: true
  });
}

i18n.configure({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  queryParameter: "lang",
  directory: FRONTEND_PATH + "/locales"
});

// view engine setup

let hbs = ehbs.create({
  defaultLayout: "main",
  layoutsDir: path.join(VIEWS_PATH, "layouts"),
  partialsDir: path.join(VIEWS_PATH, "partials"),
  extname: ".hbs",
  helpers: {
    localeURL: function (locale, data) { return data.data.root.path + "?lang=" + locale; },
    url: function () {
      let list = __SLICE.call(arguments);
      let data = list.pop();
      return "/" + __SLICE.call(list).join("/") + "?lang=" + data.data.root.locale;
    },
    i18n: function () {
      let list = __SLICE.call(arguments);
      let data = list.pop();
      return data.data.root.__.apply(this, list);
    }
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
app.use(function (req, res, next) {
  res.locals.locales = _.map(LOCALES, function (locale) { return {locale: locale, isActive: locale === req.locale}; });
  res.locals.path = req.path;
  next();
});
app.use(require("less-middleware")(path.join(FRONTEND_PATH, "public")));
app.use(express.static(path.join(FRONTEND_PATH, "public")));

_.each(ROUTES, function (value, route) {
  app.use("/api/v1" + route, value.apiRouter);
  app.use("/api" + route, value.apiRouter);
  app.use(route, value.router);
});

// error handlers

app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

if (DEBUG) {
  // development error handler
  app.use(function (err, req, res, next) {
    debugError(err);
    err = {status: err.status || 500, message: err.message, stack: err.stack};
    if (req.path.startsWith("/api/")) {
      res.status(err.status).setHeader("Content-Type", "application/json;charset=utf-8");
      res.send(JSON.stringify({error: err, path: req.path}, null, 2));
    } else {
      res.status(err.status).render("error", {error: err, path: req.path});
    }
  });
} else {
  // production error handler
  app.use(function (err, req, res, next) {
    err = {status: err.status || 500, message: err.message};
    if (req.path.startsWith("/api/")) {
      res.status(err.status).setHeader("Content-Type", "application/json;charset=utf-8");
      res.send({error: err, path: req.path});
    } else {
      res.status(err.status).render("error", {error: err, path: req.path});
    }
  });
}

module.exports = app;
