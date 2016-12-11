var Client = require('hdm-client');
var client = new Client();

module.exports = function(lecture) {
    'use strict';

    client.searchDetails('lecture', lecture, function(err, data) {
    });
};