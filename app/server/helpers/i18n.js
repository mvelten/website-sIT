"use strict";

const __SLICE = Array.prototype.slice;

/*===================================================== Exports  =====================================================*/

module.exports = translate;

/*==================================================== Functions  ====================================================*/

function translate() {
  let list = __SLICE.call(arguments);
  let root = list.pop().data.root;
  return root.__.apply(root, list);
}
