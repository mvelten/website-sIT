"use strict";

let _ = require("lodash");
let Promise = require("bluebird");

let event = require("../services/event");
let Router = require("../services/Router");

let router = new Router();

/*===================================================== Exports  =====================================================*/

exports.router = router.router;
exports.apiRouter = router.apiRouter;

/*------------------------------------------------------ Routes ------------------------------------------------------*/

router.get("/", "archive", getArchiveData);
router.get("/:year", "year", getYearData);
router.get("/:year/plain", "yearPlain", getYearData);
router.router.get("/:year/assets/*", sendAssetsFile);
router.apiRouter.get("/:year/assets/*", sendAssetsFile);
router.router.get("/:year/poster/*", sendPosterFile);
router.apiRouter.get("/:year/poster/*", sendPosterFile);
router.get("/:year/*", "eventPage", getPageData);

/*==================================================== Functions  ====================================================*/

function getArchiveData(req) {
  return event
      .readIndex()
      .then(function (index) {
        return Promise.all(_.map(index.archive, function (year) {
          return Promise
              .props({
                year: year,
                overview: event.readOverview(year),
                poster: event.checkPoster(year)
              })
              .then(_.partial(event.localize, _, req.locale));
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
        return event.readOne(year, req.locale);
      });
}

function getPageData(req) { return event.getPageData(req.params.year, req.locale, req.params[0]); }

function sendAssetsFile(req, res, next) {
  if (!req.params[0]) { return next(); }
  event
      .isPublic(req.params.year, req.params[0])
      .then(function (file) { res.sendFile(file); }, _.ary(next, 0));
}

function sendPosterFile(req, res, next) {
  if (!req.params[0]) { return next(); }
  event
      .isPoster(req.params.year, req.params[0])
      .then(function (file) { res.sendFile(file); }, _.ary(next, 0));
}
