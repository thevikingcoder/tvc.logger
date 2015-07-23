/*!
 * @projectName: tvc.logger
 * @version: 1.1.0
 * @author: Bill Brady <bill@thevikingcoder.com>
 * @file: libs/file.log.js
 * @date: 7/19/15
 */

"use strict";

/**
 * Module Dependencies
 */

var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var moment = require('moment');
var jf = require('jsonfile');
var _ = require('lodash');

exports = module.exports = {};

/**
 * Default variables
 */

var appPath = path.dirname(require.main.filename),
    defaultPath = path.join(appPath, 'logs'),
    logFile,
    defaultVars = {
        "extension": "txt",
        "tsFormat": "HH:mm:ss.SSS",
        "logFormat": "text",
        "logSeparator": " - ",
        "filenameFormat": "YYYY-MM-DD",
        "defaultPath": defaultPath,
        "customPath": null,
        "logPath": null
    };

exports.config = function(opts) {
    _.forEach(opts, function(value, name) {
        if(_.keys(defaultVars).indexOf(name) > -1) {
            defaultVars[name] = value;
        }
    });
    defaultVars.logPath = checkPath();
};

/**
 * Writes log entry to file
 * @param msg {string}
 */

exports.write = function(msg) {
    logFile = genFile();

    if (defaultVars.logFormat == 'json') {
        var current = jf.readFileSync(logFile);
        current.push(msg);
        jf.writeFileSync(logFile, current, {spaces: 2});
    } else {
        msg += "\r\n";
        fs.appendFileSync(logFile, msg);
    }
};

/**
 * Module Functions
 */

/**
 * @returns {string} - Formatted timestamp
 */

function ts() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
}

/**
 * Checks if file/path exists
 * @param file {string} - File or path to check
 * @returns {boolean}
 */

function exists(file) {
    try {
        fs.lstatSync(file);
        return true;
    } catch (err) {
        return err && err.code === "ENOENT" ? false : true;
    }
}

/**
 * @param ext {string} - File extension to check
 * @returns {string}
 */

function normalizeExt(ext) {
    if(ext.slice(0,1) !== '.') {
        return '.' + ext;
    }
    return ext;
}

/**
 * @param p {string} - Path to normalize
 * @returns {string}
 */

function normalizePath(p) {
    if(p.slice(-1) !== path.sep) {
        return p += path.sep;
    }
    return p;
}

/**
 * Creates the logfile path
 * @returns {string}
 */

function checkPath() {
    var p = defaultVars.customPath || defaultVars.defaultPath;

    if (p.indexOf('~') > -1) {
        var pX = p.split('~'),
            pathArray = [];
        pathArray.push(pX[0]);
        if (pX[1].indexOf('|') > -1) {
            pX = pX[1].split('|');
            _.forEach(pX, function(part) {
                pathArray.push(moment().format(part));
            });
        }
        p = pathArray.join(path.sep);
    }

    if(!exists(p)) {
        if (p.indexOf(appPath) == -1) {
            p = path.join(appPath, p);
        }
        mkdirp(p, function(err) {
            if(err) {
                console.error(ts() + ' : ' + err);
            } else {
                console.log(ts() + ' - Path created : ' + p);
                return normalizePath(p);
            }
        });
    } else {
        return normalizePath(p);
    }

}

/**
 * @returns {string} - File to write log entries to
 */

function genFile() {
    var file;

    if (!defaultVars.logPath) {
        defaultVars.logPath = checkPath();
    }

    if (defaultVars.logFormat == "json") {
        defaultVars.extension = "json";
    }
    else if (defaultVars.logFormat == "csv" && defaultVars.extension == "txt") {
        defaultVars.extension = "csv";
    }

    file = moment().format(defaultVars.filenameFormat) + normalizeExt(defaultVars.extension);
    file = path.join(defaultVars.logPath, file);

    if(!exists(file)) {
        if (defaultVars.logFormat == 'json') {
            jf.writeFileSync(file, [], {spaces: 2});
            return file;
        } else {
            fs.closeSync(fs.openSync(file, 'w'));
            if(defaultVars.logFormat == 'csv') {
                var sep = defaultVars.logSeparator !== " - " || ",";
                var header = ['timestamp', 'log_type', 'log_message', 'log_function'];
                header = '"' + header.join('"' + sep + '"') + '"\r\n';
                fs.appendFileSync(file, header);
                return file;
            } else {
                return file;
            }
        }
    } else {
        return file;
    }
}