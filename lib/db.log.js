/*!
 * @projectName: tvc.logger
 * @version: 1.1.0
 * @author: Bill Brady <bill@thevikingcoder.com>
 * @file: libs/db.log.js
 * @date: 7/19/15
 */

"use strict";

/**
 * Module dependencies
 */

var moment = require('moment');
var _ = require('lodash');

exports = module.exports = {};

var defaultVars = {
    "logModel": "tvc.logs.prime",
    "tsFormat": "YYYY-MM-DD HH:mm:ss.SSS"
};
var logModel;

/**
 * @returns {string} - Formatted timestamp
 */

function ts() {
    return moment().format(defaultVars.tsFormat);
}

/**
 * Update default variables
 * @param opts {object}
 */

exports.config = function(opts) {
    _.forEach(opts, function(value, name) {
        if(_.keys(defaultVars).indexOf(name) > -1) {
            defaultVars[name] = value;
        }
    });
};

/**
 * @param doc {object} - Model object to write to db
 */

exports.write = function(doc) {
    if (logModel === undefined) {
        logModel = mgCon();
    }
    var logNew = new logModel.Prime(doc);

    logNew.save(function(err) {
        if(err) {
            console.error(ts() + ' - ' + err);
        }
    });
};

function mgCon() {
    return require("./models/log")(defaultVars.logModel);
}