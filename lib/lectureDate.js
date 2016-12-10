var Client = require('hdm-client');
var client = new Client();

module.exports = function(lecture, done) {
    'use strict';

    client.searchDetails('lecture', lecture,  function() {
        done();
    });
};