"use strict";

let _ = require("lodash");
let express = require("express");

let event = require("../services/event");
let Router = require("../services/Router");

let router = new Router();

/*===================================================== Exports  =====================================================*/

exports.router = router.router;
exports.apiRouter = router.apiRouter;

/*------------------------------------------------------ Routes ------------------------------------------------------*/

router.get("/:year", "year", getYearData);

/*==================================================== Functions  ====================================================*/

function getYearData(req) {
  return event
      .readIndex()
      .then(function (index) {
        var year = req.params.year;
        if (!_.includes(index.archive, year)) {
          let err = new Error("Not Found");
          err.status = 404;
          throw err;
        }
        return event.readOne(year).then(function (data) { return {data: data, year: year}; });
      });
}
