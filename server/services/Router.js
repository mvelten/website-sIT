"use strict";

let _ = require("lodash");
let express = require("express");
let debugError = require("debug")("sIT:app:error");

const DEBUG = !!process.env.DEBUG_SIT;

/*===================================================== Exports  =====================================================*/

module.exports = Router;

/*==================================================== Functions  ====================================================*/

function defaultErrorHandler(err, res) {
  debugError(err);
  res.status(500).send("Internal Server Error");
}

/*------------------------------------------------------ Router ------------------------------------------------------*/

function Router(router, apiRouter) {
  this.router = router || express.Router();
  this.apiRouter = apiRouter || express.Router();
}

_.each(["get", "post"], function (key) {
  Router.prototype[key] = function (route, view, dataGenerator, errorHandler) {
    if (typeof errorHandler !== "function") { errorHandler = defaultErrorHandler; }

    this.router[key](route, function (req, res) {
      dataGenerator(req, res).then(function (data) { res.render(view, data); }, _.partial(errorHandler, _, res, req));
    });

    if (DEBUG) {
      this.apiRouter[key](route, function (req, res) {
        res.setHeader("Content-Type", "text/plain");
        dataGenerator(req, res).then(function (value) {
          res.send(JSON.stringify(value, null, 2));
        }, _.partial(errorHandler, _, res, req));
      });
    } else {
      this.apiRouter[key](route, function (req, res) {
        res.setHeader("Content-Type", "text/plain");
        dataGenerator(req, res).then(res.send.bind(res), _.partial(errorHandler, _, res, req));
      });
    }
  }
});
