"use strict";

let _ = require("lodash");
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let path = require("path");
let express = require("express");

const BASE_PATH = path.join(__dirname, "..", "..", "presentations");

let router = express.Router();

/*===================================================== Exports  =====================================================*/

exports.router = router;
exports.apiRouter = router;

/*------------------------------------------------------ Routes ------------------------------------------------------*/

router.get("/:year/:file", sendPoster);

/*==================================================== Functions  ====================================================*/

function sendPoster(req, res, next) {
  let file = path.join(BASE_PATH, req.params.year, "poster", req.params.file);
  fs
      .accessAsync(file, fs.R_OK)
      .then(function () { res.sendFile(file); }, _.ary(next, 0));
}
