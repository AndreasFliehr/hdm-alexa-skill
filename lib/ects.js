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
    var ects, lecture, response;

    if (lectureDetails.date !== null) {
        lecture = lectureDetails.name;
        ects = lectureDetails.ects;
        response = lecture + ' hat ' + ects + ' ECTS';
    }
    return response;
}