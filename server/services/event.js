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
  return obj;
}

function preparePresentation(obj) {
  if (typeof obj.author === "string") { obj.author = author.parse(obj.author); }
  if (typeof obj.sponsor === "string") { obj.sponsor = author.parse(obj.sponsor); }
  return obj;
}
