'use strict';

const response = require('alexa-response');
let menu = require('./lib/menu');
let office = require('./lib/lecturer').office;
let officeHours = require('./lib/lecturer').officeHours;
let lectureDate = require('./lib/lecture').date;
let lectureRoom = require('./lib/lecture').room;
let ects = require('./lib/lecture').ects;
const util = require('util');
const _ = require('underscore');

const Client = require('hdm-client');
const client = new Client();

function onLaunch(done) {
    const res = response.ask('Willkommen an der HdM. Ich kann dir hilfreiche ' +
        'Informationen geben. Du kannst mich zum Beispiel fragen, wo deine ' +
        'Vorlesung stattfindet oder was es heute in der Hochschule zu essen ' +
        'gibt. Wie kann ich dir helfen?')
        .reprompt('Frag mich zum Beispiel: Was gibt es heute in ' +
            'der Hochschule zu essen?')
        .build();
    done(null, res);
}

function onIntent(intent, attributes, done) {
    const handlers = {
        LectureDateIntent: onLectureDateIntent,
        LectureRoomIntent: onLectureRoomIntent,
        OfficeHoursIntent: onOfficeHoursIntent,
        OfficeIntent: onOfficeIntent,
        EctsIntent: onEctsIntent,
        MenuIntent: onMenuIntent,
        HelpIntent: onHelpIntent,
        StopIntent: onStopIntent
    }

    const handler = handlers[intent.name] || forwardException;
    handler(intent, attributes, done);
}

function onLectureRoomIntent(intent, attributes, done) {
    if (!('lectureName' in intent.slots)) {
        return;
    }

    lectureRoom(client, intent.slots.lectureName.value, function(err, result) {
        if (err) {
            return done(err, null);
        }

        const res = response.say(result).build();
        done(null, res);
    });
}

function onLectureDateIntent(intent, attributes, done) {
    if (!('lectureName' in intent.slots)) {
        return;
    }

    lectureDate(client,intent.slots.lectureName.value, function(err, result) {
        if (err) {
            return done(err, null);
        }

        const res = response.say(result).build();
        done(null, res);
    });
}

function onEctsIntent(intent, attributes, done) {
    if (!('lectureName' in intent.slots)) {
        return;
    }

    ects(client, intent.slots.lectureName.value, function(err, result) {
        if (err) {
            return done(err, null);
        }

        const res = response.say(result).build();
        done(null, res);
    });
}

function onOfficeIntent(intent, attributes, done) {
    if (!('query' in intent.slots)) {
        return;
    }

    office(client, intent.slots.query.value, function(err, result) {
        if (err) {
            return done(err, null);
        }

        const res = response.say(result).build();
        done(null, res);
    });
}

function onOfficeHoursIntent(intent, attributes, done) {
    if (!('query' in intent.slots)) {
        return;
    }

    officeHours(client, intent.slots.query.value, function(err, result) {
        if (err) {
            return done(err, null);
        }

        const res = response.say(result).build();
        done(null, res);
    });
}

function onMenuIntent(intent, attributes, done) {
    let date;

    if (attributes && attributes.date) {
        date = attributes.date;
    } else if (intent.slots.date && intent.slots.date.value) {
        date = new Date(intent.slots.date.value);
    } else {
        date = new Date().setHours(0,0,0,0);
    }

    if (intent.slots.location && intent.slots.location.value) {
        let location = intent.slots.location.value;
        const sbarNames = ['essbar', 'hochschule'];
        if (_.contains(sbarNames, location.toLowerCase())) {
            location = 'S-Bar';
        }
        menu(client, location, date, function(err, result) {
            if (err) {
                done(err, null);
                return;
            }

            const res = response.say(result).build();
            done(null, res);
        });
    } else {
        const res = response
            .ask('Willst du in der Mensa oder an der Hochschule essen?')
            .attributes({date: date})
            .build();
        done(null, res);
    }
}

function onHelpIntent(intent, attributes, done) {
    const res = response.say('Du kannst mich fragen, ' +
        'was es an einem bestimmten Taag in der Hochschule ' +
        'oder in der Mensa zu essen gibt, ' +
        'wo das Büro eines Professors oder einer Professorin ist, ' +
        'wann ein Professor oder eine Professorin Sprechstunde hat, ' +
        'wo oder wann eine Vorlesung stattfindet ' +
        'und wie viele E C T S Punkte es für einen Kurs gibt.')
        .build();
    done(null, res);
}

function onStopIntent(intent, attributes, done) {
    const res = response.say('Na gut')
        .build();
    done(null, res);
}

function forwardException(intent, attributes, done) {
    const res = response.say('Tut mir Leid, da ist etwas schief gelaufen.')
        .build();
    done(null, res);
}

exports.handler = function(event, context, callback) {
    if (!appIdIsValid(event)) {
        const msg = 'The request doesn\'t provide a valid application id';
        callback(new Error(msg), null);
    } else if (event.request.type === 'LaunchRequest') {
        onLaunch(callback);
    } else {
        onIntent(event.request.intent, event.session.attributes, callback);
    }
};

function appIdIsValid(event) {
    const reqAppId = event.session.application.applicationId;
    const actualAppId = process.env.ALEXA_APP_ID;
    return reqAppId === actualAppId;
}