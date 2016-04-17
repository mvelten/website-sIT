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

exports.localize = localize;

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
  _.each(obj.workshops, prepareEvent);
  _.each(obj.presentations, prepareEvent);
  _.each(obj.description, function (value, key) {
    if (_.isArray(value)) { obj.description[key] = _.join(value, "\n"); }
  });
  return obj;
}

function prepareEvent(obj) {
  if (obj.author === null || typeof obj.author === "string") { obj.author = author.parse(obj.author); }
  if (typeof obj.company === "string") { obj.company = author.parse(obj.company); }
  return obj;
}

function localize(obj, locale) {
  let localizeIteratee = _.partial(localizeEvent, _, locale);
  obj.description = obj.description[locale];
  _.each(obj.workshops, localizeIteratee);
  _.each(obj.presentations, localizeIteratee);
  return obj;
}

function localizeEvent(event, locale) {
  event.short = event.short[event.short.hasOwnProperty(locale) ? locale : event.language[0]];
  event.details = event.details[event.details.hasOwnProperty(locale) ? locale : event.language[0]];
}
