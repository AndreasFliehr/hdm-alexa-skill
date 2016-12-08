var Client = require('hdm-client');
var client = new Client();

module.exports = function(lecturer, done) {
    'use strict';

    client.searchDetails('person', lecturer, function(err, data) {
        var response, responseParts;

        if (err) {
            done(err);
            return;
        }

        responseParts = data.map(function(details) {
            return buildResponse(details);
        });

        if (responseParts.length > 1) {
            response = 'Ich habe ' + data.length + ' Personen gefunden: ';
            response += responseParts.join(', ');
        } else {
            response = responseParts.join(', ');
        }

        done(null, response);
    });
};

function buildResponse(lecturerDetails) {
    'use strict';
    var name, roomNumber, response;
    name = lecturerDetails.name;
    if (lecturerDetails.room !== null) {
        roomNumber = lecturerDetails.room;
        response = 'Das Büro von ' + name +
            ' ist in Raum ' + roomNumber;
    } else {
        response = name + ' hat kein Büro';
    }
    return response;
}
