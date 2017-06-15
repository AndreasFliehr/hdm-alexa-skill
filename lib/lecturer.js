'use strict';

const _ = require('lodash');

var options = { maxResults: process.env.MAX_RESULTS};

exports.office = (client, query, done) => {
    createLecturerResponse(client, query, lecturers => {
        return lecturers.map(({ name, room }) =>
            room ? `Das Büro von ${name} ist in Raum ${room}` : `${name} hat kein Büro`
        ).join(', ');
    }, done);
};

exports.officeHours = function(client, query, done) {
    createLecturerResponse(client, query, (data) => {
        const fixZeroHours = time => time.replace(/(:\B|:$)/g, ':00');
        const [withHours, withoutHours] = _.partition(data, (person) => person.officehours);
        const officeHoursText = withHours.reduce((text, person, i)=> {
            const hours = fixZeroHours(person.officehours);
            const response =  data.length === 1 ?
                `${person.name} hat am ${hours} Sprechstunde.` :
                `${person.name}: ${hours}`;

            return i === 0 ? text + response : `${text}, ${response}`;
        }, '');

        const missingOfficeHoursText = withoutHours.length === 1 ?
            `Für ${withoutHours[0].name} sind keine Sprechzeiten eingetragen.` :
            withoutHours.reduce(
                (res, person, index) => index === 0 ? res + person.name : `${res}, ${person.name}`,
                '. Für folgende Personen sind keine Zeiten eingetragen: ');

        return withoutHours.length > 0 ? officeHoursText + missingOfficeHoursText : officeHoursText;
    }, done);
};

function createLecturerResponse(client, query, buildResponse, done) {
    client.searchDetails('person', query, options, function(err, data) {
        if (err) {
            return done(err);
        }

        const responseParts = buildResponse(data);

        let response;
        if (data.length > 1) {
            response = `Ich habe ${data.length} Personen gefunden: ${responseParts}`;
        } else if (data.length === 1) {
            response = responseParts;
        } else {
            response = 'Es wurden keine Treffer zu diesem Namen gefunden';
        }

        done(null, response);
    });
}
