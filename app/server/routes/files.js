"use strict";

let _ = require("lodash");
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let path = require("path");
let express = require("express");

const BASE_PATH = path.join(__dirname, "..", "..", "events");

let router = express.Router();

/*===================================================== Exports  =====================================================*/

exports.router = router;
exports.apiRouter = router;

/*------------------------------------------------------ Routes ------------------------------------------------------*/

router.get("/:year/*", sendFile);

/*==================================================== Functions  ====================================================*/

function sendFile(req, res, next) {
  if (!req.params[0]) { return next(); }
  let file = path.join(BASE_PATH, req.params.year, "public", req.params[0]);
  fs
      .accessAsync(file, fs.R_OK)
      .then(function () { res.sendFile(file); }, _.ary(next, 0));
}
