var Client = require('hdm-client');
var client = new Client();
var util = require('util');

exports.date = function(query, done) {
    'use strict';

    main(query, null, function(lectureDetails) {
        var i, dates, date, day, time, lecture, response;

        lecture = lectureDetails.name;
        response = lecture + ' findet am ';
        dates = lectureDetails.date.split('\n');
        for (i = 0; i < dates.length; i++) {
            date = dates[i].split(' ');
            day = buildDay(date[0]);
            time = date[1];
            if (i === 0) {
                response += day + ' von ' + time;
            } else {
                response += ' und ' + day + ' von ' + time;
            }
        }

        response += ' statt';
        return response;
    }, done);
};

exports.room = function(query, done) {
    'use strict';

    main(query, 'room', function(lectureDetails) {
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
    }, done);
};

exports.ects = function(query, done) {
    'use strict';

    main(query, 'ects', function(lectureDetails) {
        var ects, lecture, response;
        lecture = lectureDetails.name;
        ects = lectureDetails.ects;
        response = util.format('%s hat %s ECTS', lecture, ects);

        return response;
    }, done);
};

function buildDay(day) {
    'use strict';
    var daysTable =  {
        Mo: 'Montag',
        Di: 'Dienstag',
        Mi: 'Mittwoch',
        Do: 'Donnerstag',
        Fr: 'Freitag',
        Sa: 'Samstag',
        So: 'Sonntag'
    };

    return daysTable[day] || day;
}

function main(query, requiredField, buildResponse, done) {
    'use strict';

    client.searchDetails('lecture', query,  function(err, data) {
        var response, responseParts;

        if (err) {
            done(err);
            return;
        }

        responseParts = data.filter(function(lectureDetails) {
            var hasRequiredField =
                (!requiredField || lectureDetails[requiredField]);
            return (lectureDetails.date && hasRequiredField);
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
}
