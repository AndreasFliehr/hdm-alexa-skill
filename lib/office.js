var Client = require('hdm-client');
var client = new Client();

module.exports = function(lecturer, done) {
    'use strict';

    client.searchDetails('person', lecturer, function(err, data) {
        var response, i;

        if (err) {
            done(err);
            return;
        }

        if (data.length === 1) {
            response = buildResponse(data[0]);
        } else {
            response = 'Es wurden ' + data.length + ' Personen gefunden:';
            for (i = 0; i < data.length; i++) {
                response += ' ' + buildResponse(data[i]);
            }
        }

        done(null, response);
    });
};

function buildResponse(data) {
    'use strict';
    var name, roomNumber, response;
    name = data.name;
    if (data.room !== null) {
        roomNumber = data.room;
        response = 'Das Büro von ' + name +
            ' befindet sich in Raum ' + roomNumber + '.';
    } else {
        response = 'Es existiert kein Büro für ' + name + '.';
    }
    return response;
}
