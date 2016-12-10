var Client = require('hdm-client');
var client = new Client();

module.exports = function(lecture, done) {
    'use strict';

    client.searchDetails('lecture', lecture,  function(err, data) {
        var response;

        if (data.length === 0) {
            response = 'Ich habe keine Vorlesung ' +
                'mit diesem Namen gefunden.';
        }
        done(null, response);
    });
};