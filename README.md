# tvc.logger
Logging utility for the MEAN stack, logs out to console, file or MongoDB using mongoose.

## What is this repository for? ##
* Logging of any event through simple methods
* Current Version : 1.2.1

## Installation ##
```
$ npm install tvc.logger
```

## Usage ##

```js
// Require the module
var log = require("tvc.logger");
```

**Update v1.2.0**

Added OOP method

```js
var logger = require("tvc.logger/oop");
var log = new logger();
var log2 = new logger();

// Gets independent configuration options
log.config({"tsFormat": "HH:mm:ss.SSS"});
log2.config({"tsFormat": "MM-DD HH:mm:ss"});
```

## Logging Methods ##
```js

/**
 * Standard log message
 * @param _message {string|object} - Log message (will stringify objects)
 * @param _function {string=} - Function name (can be used for passing any string for logging purposes)
 * @param _console {boolean=} [_console=true] - Output to console
 * @param _status {number=} - HTTP status code
 */
log.info(_message, _function, _console, _status);

/**
 * Custom log message
 * @param _type {string} - Type of log entry
 * @param _message {string|object} - Log message (will stringify objects)
 * @param _function {string=} - Function name (can be used for passing any string for logging purposes)
 * @param _console {boolean=} [_console=true] - Output to console
 * @param _status {number=} - HTTP status code
 */
log.custom(_type, _message, _function, _console, _status);
```

### File Logging ###
File logging will attempt to create a directory to contain log files and will name files using MomentJS notation.

```js
// Basic
log.config({"toFile": true});
// CSV
log.config({"toFile": true, "logFormat": "csv"});
// TSV
log.config({"toFile": true, "logFormat": "csv", "extension": "tsv", "logSeparator": "\t"});
// JSON
log.config({"toFile": true, "logFormat": "json"});
```

### DB Logging ###
```js
// Default model name of 'tvc.logs.prime'
log.config({"toMongo": true});
// Change the model name to anything you'd like
log.config({"toMongo": true, "logModel": "my.log"});
```

## Configuration ##
### General & Console ###
| Parameter | Data Type | Default | Description | Valid Parameters |
| :-------- | :-------- | :------ | :---------- | :--------------- |
| console | boolean | true | Output log entries to console | true : false |
| logSeparator | string | " - " | Parameter separator for file / console logging | :any |
| padding | number | 8 | Used to make log types even for readability | :any |
| tsFormat | string | timestamp | MomentJS timestamp  | :any |

### File Logging ###
| Parameter | Data Type | Default | Description | Valid Parameters |
| :-------- | :-------- | :------ | :---------- | :--------------- |
| toFile | boolean | false | To write log entries to a file | true : false |
| extension | string | "txt" | File extension to use when creating file | :any |
| logFormat | string | "text" | Logfile format | text : json : csv |
| logSeparator | string | "," | logFormat "csv" and not specifiying a character | :any |
| tsFormat | string | timestamp | When using logFormat "csv" | :any |
| customPath | string | "logs" | Define custom log path relative to application path | :any |
| filenameFormat | string | "YYYY-MM-DD" | MomentJS full date | :any |

### Database Logging ###
To use database logging, an active mongoose connection must be established

| Parameter | Data Type | Default | Description | Valid Parameters |
| :-------- | :-------- | :------ | :---------- | :--------------- |
| toMongo | boolean | false | To write log entries to database | true : false |
| logModel | string | "tvc.logs.prime" | Collection name | :any |

## Examples ##
```js
log.debug('Debug message');
// 2015-07-19 15:07:14.569 - DEBUG    - Debug Message
log.info("Info message");
// 2015-07-19 15:07:14.567 - INFO     - Info Message
log.warning('Warning message');
// 2015-07-19 15:07:14.570 - WARNING  - Warning message
log.error('Error message');
// 2015-07-19 15:07:14.570 - ERROR    - Error message
log.critical('Critical message');
// 2015-07-19 15:07:14.570 - CRITICAL - Critical message
log.fatal('Fatal message');
// 2015-07-19 15:07:14.571 - FATAL    - Fatal message
log.custom('custom', 'Custom message');
// 2015-07-19 15:07:14.571 - CUSTOM   - Custom message
```
