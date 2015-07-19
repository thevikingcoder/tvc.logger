/*!
 * @projectName: tvc.logger
 * @version: 1.1.0
 * @author: Bill Brady <bill@thevikingcoder.com>
 * @file: /example.js
 * @date: 7/19/15
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