/*!
 * @projectName: tvc.logger
 * @version: 1.2.0
 * @author: Bill Brady <bill@thevikingcoder.com>
 * @file: tvc.logger/oop.js
 * @date: 7/23/15
 */

var _ = require('lodash');
var moment = require('moment');

var tvcLogger = function () {

    var $this = this;

    $this.defaultVars = {
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

    $this.config = function (opts) {
        var n = 0;
        _.forEach(opts, function (value, name) {
            if (_.keys($this.defaultVars).indexOf(name) > -1) {
                $this.defaultVars[name] = value;
            }
            n++;
            if (n == _.keys(opts).length) {
                checkOpts();
            }
        });

        function checkOpts() {
            if ($this.defaultVars.toMongo) {
                $this.defaultVars.mongoLog = require("./libs/db.log");
                $this.defaultVars.mongoLog.config(opts);
            }
            if ($this.defaultVars.toFile) {
                $this.defaultVars.fileLog = require("./libs/file.log");
                $this.defaultVars.fileLog.config(opts);
            }
        }
    };

    $this.debug = function (_message, _function, _console, _status) {
        handleLog('debug', _message, _function, _console, _status);
    };

    $this.info = function(_message, _function, _console, _status) {
        handleLog('info', _message, _function, _console, _status)
    };

    $this.warning = function(_message, _function, _console, _status) {
        handleLog('warning', _message, _function, _console, _status)
    };

    $this.error = function(_message, _function, _console, _status) {
        handleLog('error', _message, _function, _console, _status)
    };

    $this.critical = function(_message, _function, _console, _status) {
        handleLog('critical', _message, _function, _console, _status)
    };

    $this.fatal = function(_message, _function, _console, _status) {
        handleLog('fatal', _message, _function, _console, _status)
    };

    $this.custom = function(_type, _message, _function, _console, _status) {
        handleLog(_type, _message, _function, _console, _status)
    };

    function handleLog(_type, _message, _function, _console, _status) {
        if (typeof _message == "object") {
            parseMsg(_type, _message);
        } else {
            _console = _console || $this.defaultVars.console;
            doLog(_type, _message, _function, _console, _status);
        }
    }

    function doLog(_type, _message, _function, _console, _status) {
        var msg;
        if ($this.defaultVars.logFormat == "json") {
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
            if ($this.defaultVars.logFormat == "csv") {
                var sep = $this.defaultVars.logSeparator !== " - " || ",";
                msg = [];
                msg.push(moment().format("YYYY-MM-DD HH:mm:ss"));
                msg.push(_type.trim());
                msg.push(_message.trim());
                if (_function) {
                    msg.push(_function.trim());
                } else {
                    msg.push("null");
                }
                msg = '"' + msg.join('"' + sep + '"') + '"';
            } else {
                msg = msgStdOut(_type, _message, _function, _status);
            }
        }
        if ($this.defaultVars.toMongo) {
            $this.defaultVars.mongoLog.write({
                "type": _type,
                "status_code": _status,
                "function": _function,
                "message": _message
            });
        }
        if ($this.defaultVars.toFile) {
            $this.defaultVars.fileLog.write(msg);
        }
        if (_console)
            console.log(msgStdOut(_type, _message, _function, _status, true));
    }

    function msgStdOut(_type, _message, _function, _status, default_sep) {
        var ts = moment().format($this.defaultVars.tsFormat),
            msg = [];

        if (typeof _message == "object") { _message = JSON.stringify(_message) }

        msg.push(ts);
        msg.push((_type + '          ').slice(0, $this.defaultVars.padding).toUpperCase());
        msg.push(_message);
        if (_function) { msg.push(_function) }
        if (_status) { msg.push('Status Code : ' + _status) }

        if (default_sep) { return msg.join($this.defaultVars.defaultSep).replace(/"/g, "") }
        if ($this.defaultVars.logFormat == "csv") {
            return '"' + msg.join('"' + $this.defaultVars.logSeparator + '"') + '"'
        }

        return msg.join($this.defaultVars.logSeparator);
    }

    function parseMsg(_type, msg) {
        var _message = null,
            _function = null,
            _console = defaultVars.console,
            _status = null;
        if (typeof msg == "object") {
            if (msg['message']) {
                _message = typeof msg['message'] == "object" ? JSON.stringify(msg['message']) : msg['message'];
            }
            if (msg['function']) { _function = msg['function'] }
            if (msg['console_out']) { _console = msg['console_out'] }
            if (msg['status_code']) { _status = msg['status_code'] }
        }
        else if (typeof msg == "string") { _message = msg }
        if (!_type || !_message) {
            msgStdOut('warning', 'Improperly formed message object : ' + JSON.stringify(msg));
        }
        doLog(_type, _message, _function, _console, _status);
    }

};

module.exports = tvcLogger;