var Client = require('hdm-client');
var client = new Client();
var util = require('util');

module.exports = function(lecture, done) {
    'use strict';

    client.searchDetails('lecture', lecture, function(err, data) {
        var response, responseParts;

        responseParts = data.filter(function(lectureDetails) {
            return (lectureDetails.course !== null);
        }).map(function(details) {
            return buildResponse(details);
        });
        response = responseParts[0];
        done(null, response);
    });
};

function buildResponse(lectureDetails) {
    'use strict';
    var lecture, room, response;

    lecture = lectureDetails.name;
    room = lectureDetails.room;
    response = lecture + ' findet in Raum ' + room + ' statt.';
    return response;
}