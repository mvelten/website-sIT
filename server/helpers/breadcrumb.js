"use strict";

let _ = require("lodash");

let locales = require("../../frontend/locales/en.json");

/*===================================================== Exports  =====================================================*/

module.exports = createBreadcrumb;

/*==================================================== Functions  ====================================================*/

function createBreadcrumb(data) {
  let root = data.data.root;
  let path = root.path.endsWith("/") ? root.path.substring(0, root.path.length - 1) : root.path;
  let splitPath = path.split("/"), _last = splitPath.length - 1;
  let html = "";
  _.reduce(splitPath, function (result, value, idx) {
    let key = value || "home";
    let content = locales.navigation.hasOwnProperty(key) ? root.__.call(root, "navigation." + key) : value;
    result += value;
    if (idx === _last) {
      html += "<li class=\"active\">" + content + "</li>";
    } else {
      html += "<li><a href=\"" + result + "?lang=" + root.locale + "\">" + content + "</a></li>";
    }
    return result + (value.length ? "/" : "");
  }, "/");
  return html;
}
