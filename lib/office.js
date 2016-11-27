var Client = require('hdm-client');
var client = new Client();

module.exports = function(type, lecturer, done) {
    'use strict';

    client.searchDetails(function(err, data) {
        var roomNumber, response;

        if (err) {
            done(err);
            return;
        }

        roomNumber = data[0].room;

        response = 'Das Büro von ' + lecturer +
            ' befindet sich in Raum ' + roomNumber;

        done(null, response);
    });
};
