"use strict";

const __SLICE = Array.prototype.slice;

/*===================================================== Exports  =====================================================*/

module.exports = join;

/*==================================================== Functions  ====================================================*/

function join() {
  let list = __SLICE.call(arguments);
  let root = list.pop().data.root;
  return "/" + __SLICE.call(list).join("/") + "?lang=" + root.locale;
}
