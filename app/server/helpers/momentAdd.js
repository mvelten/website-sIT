"use strict";

var moment = require("moment");

/*===================================================== Exports  =====================================================*/

module.exports = add;

/*==================================================== Functions  ====================================================*/

function add(obj, add, options) {
  let root = options.data.root;
  let hash = options.hash;
  moment.locale(root.locale);
  return moment(obj, hash.input).add(add, hash.unit).format(hash.format);
}
