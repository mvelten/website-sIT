"use strict";

const REGEX = /^\s*?([^\(<]+?)\s*?(?:<([^>]*?)>)?\s*?(?:\(([^\)]*?)\))?$/;

/*===================================================== Exports  =====================================================*/

exports.parse = parse;

/*==================================================== Functions  ====================================================*/

function parse(string) {
  if (string === null) { return {name: null}; }
  let data = REGEX.exec(string);
  if (data == null) { throw new Error("Invalid author string."); }
  let result = {name: data[1]};
  if (data[2]) { result.email = data[2]; }
  if (data[3]) { result.website = data[3]; }
  return result;
}
