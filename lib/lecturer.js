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

exports.officeHours = function(client, prof, done) {
    'use strict';

    client.searchDetails('person',prof, {}, function(err, res) {
        var response,i, person, personsWithoutOfficeHours, hours, fixZeroHours;

        if (err) {
            done(err);
            return;
        }

        fixZeroHours = function(time) {
            return time.replace(/(:\B|:$)/g, ':00');
        };


        if (res.length === 0) {
            done(null, 'Es wurden keine Treffer zu diesem Namen gefunden');
        } else if (res.length === 1) {
            person = res[0];

            if (person.officehours === null) {
                response = 'Für ' + person.name +
                 ' sind keine Sprechzeiten eingetragen.';
            } else {
                response = person.name + ' hat am ' +
                fixZeroHours(person.officehours) + ' Sprechstunde.' ;
            }

            done(null, response);
        } else if (res.length >= 1) {
            personsWithoutOfficeHours = [];
            response = 'Es wurden mehrere Treffer zu diesem Namen gefunden: ';

            for (i = 0; i < res.length; i++) {
                person = res[i];
                if (person.officehours !== null) {
                    hours = fixZeroHours(person.officehours);
                    response += person.name + ': ' + hours + ', ';
                } else {
                    personsWithoutOfficeHours.push(person);
                }
            }
            response = response.substring(0, response.length - 2);


            response +=
            '. Für folgende Personen sind keine Zeiten eingetragen: \n';

            for (i = 0; i < personsWithoutOfficeHours.length; i++) {
                person = personsWithoutOfficeHours[i];
                response += person.name + ', ';
            }
            response = response.substring(0, response.length - 2);

            done(null, response);
        }

    });
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
