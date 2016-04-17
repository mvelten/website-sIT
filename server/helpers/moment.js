"use strict";

var moment = require("moment");

/*===================================================== Exports  =====================================================*/

module.exports = i18nDate;

/*==================================================== Functions  ====================================================*/

function i18nDate(obj, options) {
  let root = options.data.root;
  let hash = options.hash;
  moment.locale(root.locale);
  return moment(obj, hash.input).format(hash.format);
}
