"use strict";

let _ = require("lodash");

const ITEMS = ["home", "upcoming", "location", "archive"];
const REGEX = /^\/(upcoming|location|archive|)(?:\/|$)/;

/*===================================================== Exports  =====================================================*/

module.exports = createItems;

/*==================================================== Functions  ====================================================*/

function createItems(data) {
  let root = data.data.root;
  let html = "";
  let active = REGEX.exec(root.path);
  if (active != null) { active = active[1] || "home"; }
  _.each(ITEMS, function (item) {
    let content = root.__.call(root, "navigation." + item);
    let link = "/" + (item === "home" ? "" : item) + "?lang=" + root.locale;
    if (item === active) {
      html += "<li class=\"active\"><a>" + content + "</a></li>";
    } else {
      html += "<li><a href=\"" + link + "\">" + content + "</a></li>"
    }
  });
  return html;
}
