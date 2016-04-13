"use strict";

let _ = require("lodash");
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let path = require("path");
let express = require("express");

let router = express.Router();

const FA_BASE = path.join(__dirname, "../../node_modules/font-awesome/fonts");

/*===================================================== Exports  =====================================================*/

exports.router = router;

/*------------------------------------------------------ Routes ------------------------------------------------------*/

router.get("/:file", function (req, res, next) {
  var sourceFile = path.join(FA_BASE, req.params.file);
  fs
      .accessAsync(sourceFile, fs.R_OK)
      .then(function () { res.sendFile(sourceFile); }, _.ary(next));
});
