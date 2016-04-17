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

function getUpcomingData(req) {
  return event
      .readIndex()
      .then(function (index) {
        let year = index.upcoming;
        return event
            .readOne(year)
            .then(function (data) { return {year: year, data: event.localizePresentation(data, req.locale)}; });
      });
}
