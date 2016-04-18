"use strict";

let _ = require("lodash");

/*===================================================== Exports  =====================================================*/

module.exports = withLookup;

/*==================================================== Functions  ====================================================*/

function withLookup(obj, key, options) { return options.fn(_.assign({key: key}, obj[key]));}
