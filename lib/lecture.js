var util = require('util');

exports.date = function(client, query, done) {
    'use strict';

    main(client, query, null, function(lectureDetails) {
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

exports.room = function(client, query, done) {
    'use strict';

    main(client, query, 'room', function(lectureDetails) {
        var i, j, dates, date, day, time, lecture, room, rooms, response;

        lecture = lectureDetails.name;
        response = lecture + ' findet am ';
        rooms = lectureDetails.room.split('/');
        dates = lectureDetails.date.split('\n');
        for (i = 0; i < rooms.length; i++) {
            room = rooms[i].split(' ');
            if (i === 0) {
                for (j = 0; j < dates.length; j++) {
                    date = dates[j].split(' ');
                    day = buildDay(date[0]);
                    time = date[1];
                    if (j === 0) {
                        response += day + ' von ' + time;
                    } else if (rooms.length === 1) {
                        response += ' und ' + day + ' von ' + time;
                    }
                }
                response += ' in Raum ' + room;
            } else {
                for (j = 0; j < dates.length; j++) {
                    date = dates[j].split(' ');
                    day = buildDay(date[0]);
                    time = date[1];
                    if (j === i) {
                        response += ' und ' + day + ' von ' + time;
                    }
                }
                response += ' in Raum ' + room;
            }
        }

        response += ' statt';
        return response;
    }, done);
};

exports.ects = function(client, query, done) {
    'use strict';

    main(client, query, 'ects', function(lectureDetails) {
        var ects, lecture, response;
        lecture = lectureDetails.name;
        ects = lectureDetails.ects;
        response = util.format('Für %s gibt es %s E C T S Punkte',
            lecture, ects);

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

function main(client, query, requiredField, buildResponse, done) {
    'use strict';

    var options = { maxResults: process.env.MAX_RESULTS};

    client.searchDetails('lecture', query, options, function(err, data) {
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
