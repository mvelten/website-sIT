"use strict";

let _ = require("lodash");
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let path = require("path");

let author = require("./author");

const BASE_PATH = path.join(__dirname, "..", "..", "presentations");

/*===================================================== Exports  =====================================================*/

exports.readIndex = readIndex;
exports.readOne = readOne;

exports.localizePresentation = localizePresentation;

/*==================================================== Functions  ====================================================*/

function readOne(year) {
  return fs
      .readFileAsync(path.join(BASE_PATH, year, "index.json"))
      .then(JSON.parse)
      .then(prepareYear);
}

function readIndex() {
  return fs
      .readFileAsync(path.join(BASE_PATH, "index.json"))
      .then(JSON.parse);
}

function prepareYear(obj) {
  _.each(obj.presentations, preparePresentation);
  _.each(obj.description, function (value, key) {
    if (_.isArray(value)) { obj.description[key] = _.join(value, "\n"); }
  });
  return obj;
}

function preparePresentation(obj) {
  if (typeof obj.author === "string") { obj.author = author.parse(obj.author); }
  if (typeof obj.sponsor === "string") { obj.sponsor = author.parse(obj.sponsor); }
  return obj;
}

function localizePresentation(obj, locale) {
  obj.description = obj.description[locale];
  _.each(obj.presentations, function (obj) {
    obj.short = obj.short[obj.short.hasOwnProperty(locale) ? locale : obj.language[0]];
    obj.details = obj.details[obj.details.hasOwnProperty(locale) ? locale : obj.language[0]];
  });
  return obj;
}
