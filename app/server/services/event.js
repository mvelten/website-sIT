"use strict";

let _ = require("lodash");
let Promise = require("bluebird");
let fs = Promise.promisifyAll(require("fs"));
let path = require("path");
let ehbs = require("express-handlebars");
let MarkdownIt = require("markdown-it");

let author = require("./author");

const BASE_PATH = path.join(__dirname, "..", "..", "events");

let md = new MarkdownIt();

/*===================================================== Exports  =====================================================*/

exports.readIndex = readIndex;

exports.readOne = readOne;
exports.readOverview = readOverview;
exports.checkPoster = checkPoster;

exports.localize = localize;

exports.isPublic = isPublic;
exports.isPoster = isPoster;
exports.getPageData = getPageData;

/*==================================================== Functions  ====================================================*/

function isPublic(year, asset) {
  let file = path.join(BASE_PATH, year, "assets", asset);
  return fs
      .accessAsync(file, fs.R_OK)
      .thenReturn(file);
}

function isPoster(year, asset) {
  let file = path.join(BASE_PATH, year, "poster", asset);
  console.log(file);
  return fs
      .accessAsync(file, fs.R_OK)
      .thenReturn(file);
}

function getPageData(year, locale, query) {
  let fileMD = path.join(BASE_PATH, year, "pages", query + ".md");
  let fileHBS = path.join(BASE_PATH, year, "pages", query + ".hbs");
  return Promise
      .any([
        fs.accessAsync(fileMD, fs.R_OK).thenReturn(true),
        fs.accessAsync(fileHBS, fs.R_OK).thenReturn(false)
      ])
      .then(function (isMarkdown) {
        return fs
            .readFileAsync(isMarkdown ? fileMD : fileHBS)
            .then(function (content) { return isMarkdown ? md.render(content.toString()) : content.toString(); })
            .then(function (content) {
              return Promise
                  .join(
                      readJSONNoFail(path.join(BASE_PATH, year, "workshops.json"))
                          .then(function (res) { return _.find(res.workshops, {page: query}); }),
                      readJSONNoFail(path.join(BASE_PATH, year, "presentations.json"))
                          .then(function (res) {
                            let key = _.findKey(res, {page: query});
                            return key == null ? null : _.assign(res[key], {id: key});
                          }),
                      readJSONNoFail(path.join(BASE_PATH, year, "schedule.json")),
                      function (workshop, presentation, schedule) {
                        let result = {year: year, partials: {body: ehbs.instance.handlebars.compile(content)}};
                        return preparePageEvent(workshop, presentation, schedule, locale, result);
                      }
                  );
            });
      }, function () { throw new Error("Page not found."); });
}

function preparePageEvent(workshop, presentation, schedule, locale, result) {
  if (workshop != null) {
    result.event = workshop;
    result.isWorkshop = true;
  } else if (presentation != null) {
    result.event = presentation;
    result.isPresentation = true;
    presentation.times = [];
    _.each(schedule, function (list, date) {
      _.each(list, function (entry) {
        if (entry.presentation === presentation.id) {
          let item = {datetime: date + " " + entry.time};
          if (!_.isUndefined(presentation.duration)) { item.duration = presentation.duration; }
          presentation.times.push(item);
        }
      });
    });
    delete presentation.duration;
    delete presentation.id;
  }
  if (result.event != null) {
    prepareEvent(result.event);
    localizeEvent(result.event, locale);
    delete result.event.page;
  }
  return result;
}

function readOne(year, locale) {
  let dir = path.join(BASE_PATH, year);
  return Promise
      .props({
        year: year,
        overview: readOverview(year),
        schedule: readJSONNoFail(path.join(dir, "schedule.json")),
        presentations: readJSONNoFail(path.join(dir, "presentations.json")),
        workshops: readJSONNoFail(path.join(dir, "workshops.json")).then(function (res) { return res.workshops; }),
        poster: checkPoster(year)
      })
      .then(prepareYear)
      .then(_.partial(localize, _, locale));
}

function checkPoster(year) {
  return fs
      .accessAsync(path.join(BASE_PATH, year, "poster"), fs.R_OK)
      .thenReturn({
        small: "sIT-" + year + "-200.jpg",
        full: "sIT-" + year + "-full.jpg"
      })
      .catchReturn(null);
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
  obj.hasFooter = obj.author != null || obj.page != null || obj.assets != null;
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
