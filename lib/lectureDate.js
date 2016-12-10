var Client = require('hdm-client');
var client = new Client();

module.exports = function(lecture, done) {
    'use strict';

    client.searchDetails('lecture', lecture,  function(err, data) {
        var response, responseParts;

        if (err) {
            done(err);
            return;
        }

        if (data !== 'undefined') {
            responseParts = data.filter(function(lectureDetails) {
                return (lectureDetails.date !== null);
            }).map(function(details) {
                return buildResponse(details);
            });
        }

        if (responseParts.length > 1) {
            response = 'Ich habe ' + responseParts.length +
                ' Vorlesungen gefunden: ';
            response += responseParts.join(', ');
        } else if (responseParts.length === 1) {
            response = responseParts.join(' ');
        } else {
            response = 'Ich habe keine Vorlesung ' +
                'mit diesem Namen gefunden.';
        }
        done(null, response);
    });
};

function buildResponse(lectureDetails) {
    'use strict';
    var i, dates, date, day, time, lecture, response;

    if (lectureDetails.date !== null) {
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
    }
    return response;
}

function buildDay(dayShort) {
    'use strict';
    var day;
    switch (dayShort) {
        case 'Mo': {
            day = 'Montag';
            break;
        }
        case 'Di': {
            day = 'Dienstag';
            break;
        }
        case 'Mi': {
            day = 'Mittwoch';
            break;
        }
        case 'Do': {
            day = 'Donnerstag';
            break;
        }
        case 'Fr': {
            day = 'Freitag';
            break;
        }
        case 'Sa': {
            day = 'Samstag';
            break;
        }
        case 'So': {
            day = 'Sonntag';
            break;
        }
        default: {
            day = dayShort;
        }
    }
    return day;
}
