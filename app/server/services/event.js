"use strict";

let _ = require("lodash");
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let path = require("path");

let author = require("./author");

const BASE_PATH = path.join(__dirname, "..", "..", "events");

/*===================================================== Exports  =====================================================*/

exports.readIndex = readIndex;

exports.readOne = readOne;
exports.readOverview = readOverview;
exports.checkPoster = checkPoster;

exports.localize = localize;

/*==================================================== Functions  ====================================================*/

function readOne(year) {
  let dir = path.join(BASE_PATH, year);
  return Promise
      .props({
        overview: readOverview(year),
        schedule: readJSONNoFail(path.join(dir, "schedule.json")),
        presentations: readJSONNoFail(path.join(dir, "presentations.json")),
        workshops: readJSONNoFail(path.join(dir, "workshops.json")).then(function (res) { return res.workshops; }),
        poster: checkPoster(year)
      })
      .then(prepareYear);
}

function checkPoster(year) {
  return fs.accessAsync(path.join(BASE_PATH, year, "public", "poster"), fs.R_OK).thenReturn(true).catchReturn(false);
}

function readOverview(year) {
  let dir = path.join(BASE_PATH, year, "overview");
  return Promise
      .props({
        de: fs
            .readFileAsync(path.join(dir, "de.html"))
            .then(function (res) { return res.toString(); })
            .catchReturn(""),
        en: fs
            .readFileAsync(path.join(dir, "en.html"))
            .then(function (res) { return res.toString(); })
            .catchReturn("")
      });
}

function readJSONNoFail(file) {
  return fs
      .readFileAsync(file)
      .then(JSON.parse)
      .catchReturn({});
}

function readIndex() {
  return fs
      .readFileAsync(path.join(BASE_PATH, "index.json"))
      .then(JSON.parse);
}

function prepareYear(obj) {
  _.each(obj.workshops, prepareEvent);
  _.each(obj.presentations, prepareEvent);
  obj.schedule = _
      .chain(obj.schedule)
      .map(function (presentations, date) { return {date: date, list: presentations}; })
      .sortBy("date")
      .value();
  return obj;
}

function prepareEvent(obj) {
  if (obj.author === null || typeof obj.author === "string") { obj.author = author.parse(obj.author); }
  if (typeof obj.company === "string") { obj.company = author.parse(obj.company); }
  return obj;
}

function localize(obj, locale) {
  let localizeIteratee = _.partial(localizeEvent, _, locale);
  obj.overview = obj.overview[locale];
  _.each(obj.workshops, localizeIteratee);
  _.each(obj.presentations, localizeIteratee);
  return obj;
}

function localizeEvent(event, locale) {
  if (event.hasOwnProperty("translate")) {
    if (event.translate.hasOwnProperty(locale)) { _.assign(event, event.translate[locale]); }
    delete event.translate;
  }
}
