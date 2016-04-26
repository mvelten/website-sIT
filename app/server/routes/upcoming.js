"use strict";

let _ = require("lodash");

let event = require("../services/event");
let Router = require("../services/Router");

let router = new Router();

/*===================================================== Exports  =====================================================*/

exports.router = router.router;
exports.apiRouter = router.apiRouter;

/*------------------------------------------------------ Routes ------------------------------------------------------*/

router.get("/", "year", getUpcomingData);
router.router.get("/assets/*", sendAssetsFile);
router.apiRouter.get("/assets/*", sendAssetsFile);
router.router.get("/poster/*", sendPosterFile);
router.apiRouter.get("/poster/*", sendPosterFile);
router.get("/*", "eventPage", getPageData);

/*==================================================== Functions  ====================================================*/

function getUpcomingData(req) {
  return event
      .readIndex()
      .then(function (index) { return event.readOne(index.upcoming, req.locale); });
}

function getPageData(req) {
  return event
      .readIndex()
      .then(function (index) { return event.getPageData(index.upcoming, req.locale, req.params[0]); });
}

function sendAssetsFile(req, res, next) {
  if (!req.params[0]) { return next(); }
  event
      .readIndex()
      .then(function (index) {
        event
            .isPublic(index.upcoming, req.params[0])
            .then(function (file) { res.sendFile(file); }, _.ary(next, 0));
      });
}

function sendPosterFile(req, res, next) {
  if (!req.params[0]) { return next(); }
  event
      .readIndex()
      .then(function (index) {
        event
            .isPoster(index.upcoming, req.params[0])
            .then(function (file) { res.sendFile(file); }, _.ary(next, 0));
      });
}
