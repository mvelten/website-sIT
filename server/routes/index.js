"use strict";

let express = require("express");

let event = require("../services/event");
let Router = require("../services/Router");

let router = new Router();

/*===================================================== Exports  =====================================================*/

exports.router = router.router;
exports.apiRouter = router.apiRouter;

/*------------------------------------------------------ Routes ------------------------------------------------------*/

router.get("/", "index", getIndexData);

/*==================================================== Functions  ====================================================*/

function getIndexData() {
  return event
      .readIndex()
      .then(function (index) {
        return {events: index, title: "sIT"};
      });
}
