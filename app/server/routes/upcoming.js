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

/*==================================================== Functions  ====================================================*/

function getUpcomingData(req) {
  return event
      .readIndex()
      .then(function (index) {
        let year = index.upcoming;
        return event
            .readOne(year)
            .then(function (data) { return _.assign({year: year}, event.localize(data, req.locale)); });
      });
}
