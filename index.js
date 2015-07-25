/*!
 * @projectName: tvc.logger
 * @version: 1.2.0
 * @author: Bill Brady <bill@thevikingcoder.com>
 * @file: tvc.logger/index.js
 * @date: 7/23/15
 */

/*!
 * Changes :
 * 7/23/15  - Restructured to support multiple logs through OOP
 *          - Added factory method for non-breaking change when doing require("tvc.logger")
 */

/*!
 * To Do :
 * Create callback hooks that can be attached to log types
 */

var logBase = require("./lib/base");
module.exports = new logBase();