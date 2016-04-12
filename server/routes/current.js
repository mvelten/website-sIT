"use strict";

let express = require("express");

let event = require("../services/event");
let Router = require("../services/Router");

let router = new Router();

/*===================================================== Exports  =====================================================*/

exports.router = router.router;
exports.apiRouter = router.apiRouter;

/*------------------------------------------------------ Routes ------------------------------------------------------*/

router.get("/", "year", getCurrentData);

/*==================================================== Functions  ====================================================*/

function getCurrentData() {
  return event
      .readIndex()
      .then(function (index) {
        return event.readOne(index.current).then(function (data) { return {data: data, year: index.current}; });
      });
}
