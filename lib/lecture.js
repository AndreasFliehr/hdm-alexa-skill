'use strict';

exports.date = (client, query, done) => {
    createLectureResponse(client, query, null, (details) => {
        const dates = details.date.split('\n');
        const response = dates.reduce((response, curr, i) => {
            const [dayAbbr, time] = curr.split(' ');
            const day = buildDay(dayAbbr);
            const res = `${day} von ${time}`;
            return i === 0 ? res : `${response} und ${res}`;
        }, '');

        return `${details.name} findet am ${response} statt`;
    }, done);
};

exports.room = (client, query, done) => {
    createLectureResponse(client, query, 'room', (details) => {
        const rooms = details.room.split('/');
        const dates = details.date.split('\n');
        const response = rooms.reduce((res, room, i) => {
            const dateResponse = dates.reduce((dateResponse, date, j) => {
                const [dayAbbr, time] = date.split(' ');
                const day = buildDay(dayAbbr);
                if (j === 0 && i === 0) {
                    return dateResponse + `${day} von ${time}`;
                } else if ((rooms.length === 1) || j === i) {
                    return dateResponse + ` und ${day} von ${time}`;
                } else {
                    return dateResponse;
                }
            }, '');
            return `${res + dateResponse} in Raum ${room}`;
        }, '');
        return `${details.name} findet am ${response} statt`;
    }, done);
};

exports.ects = (client, query, done) => {
    createLectureResponse(client, query, 'ects', lectureDetails => {
        const lecture = lectureDetails.name;
        const ects = lectureDetails.ects;
        return `Für ${lecture} gibt es ${ects} E C T S Punkte`;
    }, done);
};

function buildDay(day) {
    const daysTable =  {
        Mo: 'Montag',
        Di: 'Dienstag',
        Mi: 'Mittwoch',
        Do: 'Donnerstag',
        Fr: 'Freitag',
        Sa: 'Samstag',
        So: 'Sonntag'
    };

    return daysTable[day] || day;
}

function createLectureResponse(client, query, requiredField, buildResponse, done) {
    const options = { maxResults: process.env.MAX_RESULTS};

    client.searchDetails('lecture', query, options, (err, data) => {
        if (err) {
            return done(err);
        }

        const responseParts = data.filter((lectureDetails) => {
            const hasRequiredField =
                (!requiredField || lectureDetails[requiredField]);
            return (lectureDetails.date && hasRequiredField);
        }).map((details) => {
            return buildResponse(details);
        });

        const len = responseParts.length;
        let response;
        if (len > 1) {
            response = `Ich habe ${len} Vorlesungen gefunden: ${responseParts.join(', ')}`;
        } else if (len === 1) {
            response = responseParts[0];
        } else {
            response = 'Ich habe keine Vorlesung mit diesem Namen gefunden.';
        }

        done(null, response);
    });
}
