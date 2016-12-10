var Client = require('hdm-client');
var client = new Client();

module.exports = function(lecture, done) {
    'use strict';

    client.searchDetails('lecture', lecture,  function(err, data) {
        var response, responseParts;
        responseParts = data.filter(function(lectureDetails) {
            if (lectureDetails.date !== null) { return true; }
            return false;
        }).map(function(details) {
            return buildResponse(details);
        });

        if (responseParts.length > 1) {
            response = 'Ich habe ' + responseParts.length +
                ' Vorlesungen gefunden: ';
            response += responseParts.join(', ');
        } else {
            response = responseParts.join(' ');
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
            date = lectureDetails.date.split(' ');
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
            day = 'Montag';
            break;
        }
        case 'Mi': {
            day = 'Montag';
            break;
        }
        case 'Do': {
            day = 'Montag';
            break;
        }
        case 'Fr': {
            day = 'Montag';
            break;
        }
        case 'Sa': {
            day = 'Montag';
            break;
        }
        case 'So': {
            day = 'Montag';
            break;
        }
        default: {
            day = dayShort;
        }
    }
    return day;
}
