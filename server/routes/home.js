"use strict";

let express = require("express");

let event = require("../services/event");

let router = express.Router(), apiRouter = express.Router();

/*===================================================== Exports  =====================================================*/

exports.router = router;
exports.apiRouter = apiRouter;

/*------------------------------------------------------ Routes ------------------------------------------------------*/

router.get("/", function (req, res) { res.render("home/" + req.locale, getIndexData()); });
apiRouter.get("/", function (req, res) {
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.send(getIndexData());
});

/*==================================================== Functions  ====================================================*/

function getIndexData() {
  return event
      .readIndex()
      .then(function (index) {
        return {events: index, title: "sIT"};
      });
}
