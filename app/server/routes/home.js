"use strict";

let express = require("express");

let event = require("../services/event");

let router = express.Router(), apiRouter = express.Router();

/*===================================================== Exports  =====================================================*/

exports.router = router;
exports.apiRouter = apiRouter;

/*------------------------------------------------------ Routes ------------------------------------------------------*/

router.get("/", function (req, res, next) {
  getIndexData().then(function (data) { res.render("home/" + req.locale, data); }, next);
});
apiRouter.get("/", function (req, res, next) {
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  getIndexData().then(function (data) { res.send(data); }, next);
});

/*==================================================== Functions  ====================================================*/

function getIndexData() {
  return event
      .readIndex()
      .then(function (index) { return {events: index}; });
}
