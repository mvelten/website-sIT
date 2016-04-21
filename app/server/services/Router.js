"use strict";

let _ = require("lodash");
let Promise = require("bluebird");
let express = require("express");

const DEBUG = !!process.env.DEBUG_SIT;

/*===================================================== Exports  =====================================================*/

module.exports = Router;

/*==================================================== Functions  ====================================================*/

/*------------------------------------------------------ Router ------------------------------------------------------*/

function Router(router, apiRouter) {
  this.router = router || express.Router();
  this.apiRouter = apiRouter || express.Router();
}

_.each(["get", "post"], function (key) {
  Router.prototype[key] = function (route, view, dataGenerator, errorHandler) {
    if (typeof dataGenerator !== "function") { dataGenerator = _.constant(Promise.resolve({})); }
    this.router[key](route, function (req, res, next) {
      dataGenerator(req, res).then(function (data) { res.render(view, data); }, next);
    });

    if (DEBUG) {
      this.apiRouter[key](route, function (req, res, next) {
        dataGenerator(req, res)
            .then(function (value) {
              let isObject = value instanceof Object;
              let contentType = isObject ? "application/json" : "text/plain";
              if (isObject) { value = JSON.stringify(value, null, 2); }
              res.setHeader("Content-Type", contentType + ";charset=utf-8");
              res.send(value);
            }, errorHandler ? _.partial(errorHandler, _, res, req) : next);
      });
    } else {
      this.apiRouter[key](route, function (req, res, next) {
        dataGenerator(req, res)
            .then(function (value) {
              let contentType = value instanceof Object ? "application/json" : "text/plain";
              res.setHeader("Content-Type", contentType + ";charset=utf-8");
              res.send(value);
            }, errorHandler ? _.partial(errorHandler, _, res, req) : next);
      });
    }
  }
});
