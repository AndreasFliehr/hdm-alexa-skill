var Client = require('hdm-client');
var client = new Client();
var util = require('util');

module.exports = function(lecture, done) {
    'use strict';

    client.searchDetails('lecture', lecture,  function(err, data) {
        var response, responseParts;

        if (err) {
            done(err);
            return;
        }
        responseParts = data.filter(function(lectureDetails) {
            return (lectureDetails.date !== null);
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
    var ects, lecture, response;
    lecture = lectureDetails.name;
    ects = lectureDetails.ects;
    response = util.format('%s hat %s ECTS', lecture, ects);

    return response;
}