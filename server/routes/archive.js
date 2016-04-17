"use strict";

let _ = require("lodash");
let event = require("../services/event");
let Router = require("../services/Router");

let router = new Router();

/*===================================================== Exports  =====================================================*/

exports.router = router.router;
exports.apiRouter = router.apiRouter;

/*------------------------------------------------------ Routes ------------------------------------------------------*/

router.get("/", "archive", getArchiveData);
router.get("/:year", "year", getYearData);

/*==================================================== Functions  ====================================================*/

function getArchiveData(req) {
  return event
      .readIndex()
      .then(function (index) {
        return Promise.all(_.map(index.archive, function (year) {
          return event
              .readOne(year)
              .then(function (data) { return {year: year, data: event.localize(data, req.locale)}; });
        }));
      })
      .then(function (list) { return {list: list}; });
}

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
        return event
            .readOne(year)
            .then(function (data) { return {year: year, data: event.localize(data, req.locale)}; });
      });
}
