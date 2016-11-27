var Client = require('hdm-client');
var client = new Client();

module.exports = function(type, lecturer, done) {
    'use strict';

    client.searchDetails(function(err, data) {
        var roomNumber, response, name;

        if (err) {
            done(err);
            return;
        }

        name = data[0].name;
        if (data[0].room !== null) {
            roomNumber = data[0].room;
            response = 'Das Büro von ' + name +
                ' befindet sich in Raum ' + roomNumber;
        }else {
            response = 'Es existiert kein Büro für ' + name;
        }

        done(null, response);
    });
};
