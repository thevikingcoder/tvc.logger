/*!
 *  @projectName: tvc.logger
 *  @version: 1.1.0
 *  @author: Bill Brady <bill@thevikingcoder.com>
 *  @file: /index.js
 *  @date: 7/19/15
 */

'use strict';

/**
 * Module dependencies
 */

var _ = require('lodash');
var moment = require('moment');

exports = module.exports = {};

var defaultVars = {
    "toFile": false,
    "toMongo": false,
    "logModel": "tvc.logs.prime",
    "logFormat": "text",
    "logSeparator": " - ",
    "defaultSep": " - ",
    "extension": "txt",
    "tsFormat": "YYYY-MM-DD HH:mm:ss.SSS",
    "console": true,
    "padding": 8,
    "mongoLog": null,
    "fileLog": null
};

/**
 * Updates default variables
 * @param opts {object}
 */

exports.config = function(opts) {
    var n = 0;
    _.forEach(opts, function (value, name) {
        if (_.keys(defaultVars).indexOf(name) > -1) {
            defaultVars[name] = value;
        }
        n++;
        if (n == _.keys(opts).length) {
            checkOpts();
        }
    });

    function checkOpts() {
        if(defaultVars.toMongo) {
            defaultVars.mongoLog = require("./libs/db.log");
            defaultVars.mongoLog.config(opts);
        }
        if(defaultVars.toFile) {
            defaultVars.fileLog = require("./libs/file.log");
            defaultVars.fileLog.config(opts);
        }
    }
};

/**
 * Standard log messages
 * @param _message {string|object} - Log message
 * @param _function {string=} - Function name
 * @param _console {boolean=} [_console=true] - Output to console
 * @param _status {number=} - HTTP status code
 */

exports.debug = function(_message, _function, _console, _status) {
    handleLog('debug', _message, _function, _console, _status);
};

exports.info = function(_message, _function, _console, _status) {
    handleLog('info', _message, _function, _console, _status)
};

exports.warning = function(_message, _function, _console, _status) {
    handleLog('warning', _message, _function, _console, _status)
};

exports.error = function(_message, _function, _console, _status) {
    handleLog('error', _message, _function, _console, _status)
};

exports.critical = function(_message, _function, _console, _status) {
    handleLog('critical', _message, _function, _console, _status)
};

exports.fatal = function(_message, _function, _console, _status) {
    handleLog('fatal', _message, _function, _console, _status)
};

/**
 * Custom log message
 * @param _type {string} - Type of log entry
 * @param _message {string|object} - Log message
 * @param _function {string=} - Function name to be referenced
 * @param _console {boolean=} [_console=true] - Output to console
 * @param _status {number=} - HTTP status code
 */

exports.custom = function(_type, _message, _function, _console, _status) {
    handleLog(_type, _message, _function, _console, _status)
};

/**
 * Creates log entry
 * @param _type {string} - Type of log entry
 * @param _message {string|object} - Log message
 * @param _function {string=} - Function name to be referenced
 * @param _console {boolean=} [_console=true] - Output to console
 * @param _status {number=} - HTTP status code
 */

function handleLog(_type, _message, _function, _console, _status) {
    if (typeof _message == "object") {
        parseMsg(_type, _message);
    } else {
        _console = _console || defaultVars.console;
        doLog(_type, _message, _function, _console, _status);
    }
}

/**
 * Does the log entry
 * @param _type {string} - Type of log entry
 * @param _message {string|object} - Log Message
 * @param _function {string=} - Function name to be referenced
 * @param _console {boolean=} [_console=true] - Output to console
 * @param _status {number=} - HTTP status code to include
 */

function doLog(_type, _message, _function, _console, _status) {
    var msg;
    if (defaultVars.logFormat == "json") {
        msg = {
            log_date: moment().format(defaultVars.tsFormat),
            log_type: _type,
            log_message: _message
        };
        if (_function)
            msg['log_function'] = _function;
        if (_status)
            msg['log_status_code'] = _status;
    } else {
        if (defaultVars.logFormat == "csv") {
            var sep = defaultVars.logSeparator !== " - " || ",";
            msg = [];
            msg.push(moment().format("YYYY-MM-DD HH:mm:ss"));
            msg.push(_type.trim());
            msg.push(_message.trim());
            if(_function) {
                msg.push(_function.trim());
            } else {
                msg.push("null");
            }
            msg = '"' + msg.join('"' + sep + '"') + '"';
        } else {
            msg = msgStdOut(_type, _message, _function, _status);
        }
    }
    if (defaultVars.toMongo)
        defaultVars.mongoLog.write({"type": _type, "status_code": _status, "function": _function, "message": _message});
    if (defaultVars.toFile)
        defaultVars.fileLog.write(msg);
    if (_console)
        console.log(msgStdOut(_type, _message, _function, _status, true));
}

/**
 * Normalizes log entry for entry into file or output to console
 * @param _type {string} - Type of log entry
 * @param _message {string|object} - Log Message
 * @param _function {string=} - Function name to be referenced
 * @param _status {number=} - HTTP status code to include
 * @param default_sep {boolean=} [default_sep=false] - Override defaultVars.logSeparator and use defaultVars.defaultSep
 * @returns {string}
 */

function msgStdOut(_type, _message, _function, _status, default_sep) {
    var ts = moment().format(defaultVars.tsFormat),
        msg = [];

    if (typeof _message == "object") {
        _message = JSON.stringify(_message);
    }

    msg.push(ts);
    msg.push((_type + '          ').slice(0, defaultVars.padding).toUpperCase());
    msg.push(_message);
    if (_function)
        msg.push(_function);
    if (_status)
        msg.push('Status Code : ' + _status);

    if (default_sep)
        return msg.join(defaultVars.defaultSep).replace(/"/g, "");

    if (defaultVars.logFormat == "csv")
        return '"' + msg.join('"' + defaultVars.logSeparator + '"') + '"';

    return msg.join(defaultVars.logSeparator);
}

function parseMsg(_type, msg) {
    var _message = null,
        _function = null,
        _console = defaultVars.console,
        _status = null;
    if (typeof msg == "object") {
        if (msg['message'])
            _message = typeof msg['message'] == "object" ? JSON.stringify(msg['message']) : msg['message'];
        if (msg['function'])
            _function = msg['function'];
        if (msg['console_out'])
            _console = msg['console_out'];
        if (msg['status_code'])
            _status = msg['status_code'];
    }
    else if (typeof msg == "string") {
        _message = msg;
    }
    if (!_type || !_message) {
        msgStdOut('warning', 'Improperly formed message object : ' + JSON.stringify(msg));
    }
    doLog(_type, _message, _function, _console, _status);
}