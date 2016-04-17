"use strict";

let _ = require("lodash");
let fs = require("fs");
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

let scripts = require("./routes/scripts");

const DEBUG = !!process.env.DEBUG_SIT;
const FRONTEND_PATH = path.join(__dirname, "..", "frontend");
const VIEWS_PATH = path.join(FRONTEND_PATH, "views");
const LOCALES = ["en", "de"];
const LANGUAGES = {en: "English", de: "Deutsch"};
const DEFAULT_LOCALE = "de";
const ROUTES = {
  "/": [require("./routes/home"), require("./routes/legal")],
  "/upcoming": require("./routes/upcoming"),
  "/archive": require("./routes/archive"),
  "/location": require("./routes/location"),
  "/fonts": require("./routes/fonts"),
  "/scripts": scripts
};

if (DEBUG) {
  Promise.config({
    warnings: true,
    longStackTraces: true
  });
}

i18n.configure({
  indent: "  ",
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  objectNotation: true,
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
    breadcrumb: require("./helpers/breadcrumb"),
    headerItems: require("./helpers/headerItems"),
    i18n: require("./helpers/i18n"),
    localeURL: require("./helpers/localeURL"),
    moment: require("./helpers/moment"),
    momentAdd: require("./helpers/momentAdd"),
    url: require("./helpers/url"),
    withLookup: require("./helpers/withLookup")
  }
});

app.locals.SCRIPTS = scripts.scripts;

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
  res.locals.locales = _.map(LOCALES, function (locale) {
    return {locale: locale, isActive: locale === req.locale, language: LANGUAGES[locale]};
  });
  res.locals.path = req.path;
  res.locals.page = req.path.substring(1).replace(/\//g, "-") || "home";
  next();
});
app.use(require("less-middleware")(path.join(FRONTEND_PATH, "public"), {
  once: true,
  parser: {
    paths: [path.join(FRONTEND_PATH, "public", "stylesheets"), path.join(__dirname, "..", "node_modules")]
  }
}));
app.use(express.static(path.join(FRONTEND_PATH, "public")));

_.each(ROUTES, function (value, route) {
  if (_.isArray(value)) {
    _.each(value, function (value) {
      if (value.apiRouter) {
        app.use("/api/v1" + route, value.apiRouter);
        app.use("/api" + route, value.apiRouter);
      }
      app.use(route, value.router);
    })
  } else {
    if (value.apiRouter) {
      app.use("/api/v1" + route, value.apiRouter);
      app.use("/api" + route, value.apiRouter);
    }
    app.use(route, value.router);
  }
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
