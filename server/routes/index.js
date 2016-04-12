"use strict";

let express = require("express");
let Promise = require("bluebird");

let Router = require("../services/Router");

let router = new Router();

/*===================================================== Exports  =====================================================*/

exports.router = router.router;
exports.apiRouter = router.apiRouter;

/*------------------------------------------------------ Routes ------------------------------------------------------*/

router.get("/", "index", getIndexData);

/*==================================================== Functions  ====================================================*/

function getIndexData() { return Promise.resolve({title: "Express"}); }
