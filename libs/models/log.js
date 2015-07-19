/*!
 *  @projectName: tvc.logger
 *  @version: 1.1.0
 *  @author: Bill Brady <bill@thevikingcoder.com>
 *  @file: libs/models/log.js.js
 *  @date: 7/19/15
 */

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var models = {
    "prime": {
        "dt": {"type": "Date", "default": Date.now},
        "type": {"type": "String"},
        "status_code": {"type": "Number"},
        "function": {"type": "String"},
        "message": {"type": "String"},
        "viewed": {"type": "Boolean", "default": false}
    }
};

module.exports = function(logModel) {
    return {
        "Prime": mongoose.model(logModel, new Schema(models.prime))
    }
};