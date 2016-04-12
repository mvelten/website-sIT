"use strict";

var express = require('express');
var ehbs = require('express-handlebars');
var i18n = require("i18n");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var current = require('./routes/current');

var app = express();

const FRONTEND_PATH = path.join(__dirname, "..", "frontend");
const VIEWS_PATH = path.join(FRONTEND_PATH, "views");

i18n.configure({
  locales: ["en", "de"],
  defaultLocale: "de",
  queryParameter: "lang",
  directory: FRONTEND_PATH + '/locales'
});

// view engine setup

var hbs = ehbs.create({
  defaultLayout: "main",
  layoutsDir: path.join(VIEWS_PATH, "layouts"),
  partialsDir: path.join(VIEWS_PATH, "partials"),
  helpers: {
    i18n: function () { return this.__.apply(this, arguments); }
  }
});

app.engine("handlebars", hbs.engine);
app.set("views", VIEWS_PATH);
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(FRONTEND_PATH, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(i18n.init);
app.use(require('less-middleware')(path.join(FRONTEND_PATH, 'public')));
app.use(express.static(path.join(FRONTEND_PATH, 'public')));

app.use('/', routes);
app.use('/current', current);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
