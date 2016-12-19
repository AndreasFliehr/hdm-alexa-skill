exports.office = function(client, query, done) {
    'use strict';

    main(client, query, function(lecturerDetails) {
        var name, roomNumber, response;

        name = lecturerDetails.name;
        if (lecturerDetails.room) {
            roomNumber = lecturerDetails.room;
            response = 'Das Büro von ' + name +
                ' ist in Raum ' + roomNumber;
        } else {
            response = name + ' hat kein Büro';
        }
        return response;
    }, done);
};

exports.officeHours = function() {

};

function main(client, query, buildResponse, done) {
    'use strict';

    client.searchDetails('person', query, function(err, data) {
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
}