"use strict";

let express = require("express");

let router = express.Router(), apiRouter = express.Router();

/*===================================================== Exports  =====================================================*/

exports.router = router;
exports.apiRouter = apiRouter;

/*------------------------------------------------------ Routes ------------------------------------------------------*/

router.get("/", function (req, res) { res.render("location/" + req.locale, {}); });
apiRouter.get("/", function (req, res) {
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.send({});
});
