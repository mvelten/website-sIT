"use strict";

let _ = require("lodash");
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let path = require("path");
let express = require("express");

let router = express.Router();

const MODULES_BASE = path.join(__dirname, "../../node_modules");
const SCRIPTS = ["jquery/dist/jquery.min.js", "bootstrap/dist/js/bootstrap.min.js"];

/*===================================================== Exports  =====================================================*/

exports.router = router;
exports.scripts = _.map(SCRIPTS, _.ary(path.basename, 1));

/*------------------------------------------------------ Routes ------------------------------------------------------*/

_.each(SCRIPTS, function (script) {
  let basename = path.basename(script);
  let sourceFile = path.join(MODULES_BASE, script);
  router.get("/" + basename, function (req, res, next) {
    fs
        .accessAsync(sourceFile, fs.R_OK)
        .then(function () { res.sendFile(sourceFile); }, next);
  });
});
