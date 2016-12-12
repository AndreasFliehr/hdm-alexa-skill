var Client = require('hdm-client');
var client = new Client();
var util = require('util');

module.exports = function(lecture, done) {
    'use strict';

    client.searchDetails('lecture', lecture, function(err, data) {
        var response, responseParts;

        if (err) {
            done(err);
            return;
        }

        responseParts = data.filter(function(lectureDetails) {
            return (lectureDetails.room !== null);
        }).map(function(details) {
            return buildResponse(details);
        });

        if (responseParts.length > 1) {
            response = util.format('Ich habe %s Vorlesungen gefunden: %s',
                                    responseParts.length,
                                    responseParts.join(', '));
        } else if (responseParts.length === 1) {
            response = responseParts[0];
        } else {
            response = 'Ich habe keine Vorlesung mit diesem Namen gefunden.';
        }
        done(null, response);
    });
};

function buildResponse(lectureDetails) {
    'use strict';
    var i, lecture, room, rooms, response;

    lecture = lectureDetails.name;
    response = lecture + ' findet in ';
    rooms = lectureDetails.room.split('/');
    for (i = 0; i < rooms.length; i++) {
        room = rooms[i].split(' ');
        if (i === 0) {
            response += 'Raum ' + room;
        } else {
            response += ' und in Raum ' + room;
        }
    }

    response += ' statt';
    return response;
}