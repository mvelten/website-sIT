"use strict";

let _ = require("lodash");

module.exports = createBreadcrumb;

function createBreadcrumb(data) {
  let root = data.data.root;
  var path = root.path.endsWith("/") ? root.path.substring(0, root.path.length - 1) : root.path;
  let splitPath = path.split("/"), _last = splitPath.length - 1;
  let html = "";
  _.reduce(splitPath, function (result, value, idx) {
    let content = root.__.call(root, "breadcrumb." + (value || "home"));
    if (content.startsWith("breadcrumb.")) { content = value || "Home"; }
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
