/*!
 * @projectName: tvc.logger
 * @version: 1.2.0
 * @author: Bill Brady <bill@thevikingcoder.com>
 * @file: tvc.logger/example.js
 * @date: 7/23/15
 */

/**
 * Factory method
 */

var log = require("tvc.logger");

/**
 * Configuration is now set through a separate call
 */

log.config({});

log.info("Info message");
log.debug('Debug message');
log.warning('Warning message');
log.error('Error message');
log.critical('Critical message');
log.fatal('Fatal message');
log.custom('custom', 'Custom message');

/**
 * OOP method
 */

var logger = require("tvc.logger/oop");
var logOOP = new logger();
var logOOP2 = new logger();

// Independent configurations
logOOP.config({});
logOOP2.config({"tsFormat": "MM-DD HH:mm:ss.SSS"});

logOOP.custom("custom", "Custom message from logger #1");
logOOP2.custom("custom", "Custom message from logger #2");
