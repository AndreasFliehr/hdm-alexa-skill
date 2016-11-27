var Client = require('hdm-client');
var client = new Client();

module.exports = function(type, query, done) {
    'use strict';

    client.searchDetails(function(err, data) {
        var respone = 'Ausgabe: ' + data;
        done(null, respone);
    });
};
