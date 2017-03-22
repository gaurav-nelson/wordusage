'use strict';

var control = require('remark-message-control');

module.exports = filter;

function filter(proc, options) {
    var settings = options || /* istanbul ignore next */ {};
    proc.use(control, {
        name: 'wordusage',
        disable: settings.allow,
        source: ['retext-wordusage']
    });
}