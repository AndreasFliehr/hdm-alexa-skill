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
    };

    const handler = handlers[intent.name] || forwardException;
    handler(intent, attributes, done);
}

function onLectureRoomIntent(intent, attributes, done) {
    if (!('lectureName' in intent.slots)) {
        return forwardException(intent, attributes, done);
    }

    lectureRoom(client, intent.slots.lectureName.value, (err, result) => {
        if (err) {
            return done(err, null);
        }

        const res = response.say(result).build();
        done(null, res);
    });
}

function onLectureDateIntent(intent, attributes, done) {
    if (!('lectureName' in intent.slots)) {
        return forwardException(null, null, done);
    }

    lectureDate(client,intent.slots.lectureName.value, (err, result) => {
        if (err) {
            return done(err, null);
        }

        const res = response.say(result).build();
        done(null, res);
    });
}

function onEctsIntent({ slots }, attributes, done) {
    if (!('lectureName' in slots)) {
        return forwardException(null, null, done);
    }

    ects(client, slots.lectureName.value, (err, result) => {
        if (err) {
            return done(err, null);
        }

        const res = response.say(result).build();
        done(null, res);
    });
}

function onOfficeIntent({slots}, ...args) {
    const done = _.last(args);
    if (!('query' in slots)) {
        return forwardException(null, null, done);
    }

    office(client, slots.query.value, (err, result) => {
        if (err) {
            return done(err, null);
        }

        const res = response.say(result).build();
        done(null, res);
    });
}

function onOfficeHoursIntent({ slots }, ...args) {
    const done = _.last(args);
    if (!('query' in slots)) {
        return forwardException(null, null, done);
    }

    officeHours(client, slots.query.value, (err, result) => {
        if (err) {
            return done(err, null);
        }

        const res = response.say(result).build();
        done(null, res);
    });
}

function onMenuIntent({ slots }, attributes, done) {
    let date;

    if (attributes && attributes.date) {
        date = attributes.date;
    } else if (slots.date && slots.date.value) {
        date = new Date(slots.date.value);
    } else {
        date = new Date().setHours(0,0,0,0);
    }

    if (slots.location && slots.location.value) {
        let location = slots.location.value;
        const sbarNames = ['essbar', 'hochschule'];
        if (_.contains(sbarNames, location.toLowerCase())) {
            location = 'S-Bar';
        }

        menu(client, location, date, (err, result) => {
            if (err) {
                return done(err, null);
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

function onHelpIntent(...args) {
    const done = _.last(args);
    const res = response.say('Du kannst mich fragen, ' +
        'was es an einem bestimmten Tag in der Hochschule ' +
        'oder in der Mensa zu essen gibt, ' +
        'wo das Büro eines Professors oder einer Professorin ist, ' +
        'wann ein Professor oder eine Professorin Sprechstunde hat, ' +
        'wo oder wann eine Vorlesung stattfindet ' +
        'und wie viele E C T S Punkte es für einen Kurs gibt.')
        .build();
    done(null, res);
}

function onStopIntent(...args) {
    const done = _.last(args);
    const res = response.say('Na gut')
        .build();
    done(null, res);
}

function forwardException(...args) {
    const res = response.say('Tut mir Leid, da ist etwas schief gelaufen.')
        .build();
    _.last(args)(null, res);
}

exports.handler = (event, context, callback) => {
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