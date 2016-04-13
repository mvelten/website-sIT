"use strict";

let event = require("../services/event");
let Router = require("../services/Router");

let router = new Router();

/*===================================================== Exports  =====================================================*/

exports.router = router.router;
exports.apiRouter = router.apiRouter;

/*------------------------------------------------------ Routes ------------------------------------------------------*/

router.get("/", "year", getUpcomingData);

/*==================================================== Functions  ====================================================*/

function getUpcomingData() {
  return event
      .readIndex()
      .then(function (index) {
        return event
            .readOne(index.upcoming)
            .then(function (data) { return {data: data, year: index.upcoming}; });
      });
}
