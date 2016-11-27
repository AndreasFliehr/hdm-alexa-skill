var Client = require('hdm-client');
var client = new Client();

module.exports = function(type, lecturer, done) {
    'use strict';

    client.searchDetails(function(err, data) {
        var response, i;

        if (err) {
            done(err);
            return;
        }

        if (data.length === 1) {
            response = buildRepsonse(data[0]);
        } else {
            response = 'Es wurden ' + data.length + ' Personen gefunden:';
            for (i = 0; i < data.length; i++) {
                response += ' ' + buildRepsonse(data[i]);
            }
        }

        done(null, response);
    });
};

function buildRepsonse(data) {
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
