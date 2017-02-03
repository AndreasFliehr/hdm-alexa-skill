var response = require('alexa-response');
var menu = require('./lib/menu');
var office = require('./lib/lecturer').office;
var officeHours = require('./lib/lecturer').officeHours;
var lectureDate = require('./lib/lecture').date;
var lectureRoom = require('./lib/lecture').room;
var ects = require('./lib/lecture').ects;
var util = require('util');
var _ = require('underscore');

var Client = require('hdm-client');
var client = new Client();

function onLaunch(done) {
    'use strict';
    var res = response.ask('Willkommen an der HdM. Ich kann dir hilfreiche ' +
        'Informationen geben. Du kannst mich zum Beispiel fragen, wo deine ' +
        'Vorlesung stattfindet oder was es heute in der Hochschule zu essen ' +
        'gibt. Wie kann ich dir helfen?')
        .reprompt('Frag mich zum Beispiel: Was gibt es heute in ' +
            'der Hochschule zu essen?')
        .build();
    done(null, res);
}

function onIntent(intent, attributes, callback) {
    'use strict';
    if (intent.name === 'MenuIntent') {
        onMenuIntent(intent, attributes, callback);
    } else if (intent.name === 'OfficeIntent') {
        onOfficeIntent(intent, callback);
    } else if (intent.name === 'OfficeHoursIntent') {
        onOfficeHoursIntent(intent, callback);
    } else if (intent.name === 'LectureDateIntent') {
        onLectureDateIntent(intent, callback);
    } else if (intent.name === 'LectureRoomIntent') {
        onLectureRoomIntent(intent, callback);
    } else if (intent.name === 'EctsIntent') {
        onEctsIntent(intent, callback);
    } else if (intent.name === 'HelpIntent') {
        onHelpIntent(callback);
    } else if (intent.name === 'StopIntent') {
        onStopIntent(callback);
    } else {
        forwardException(callback);
    }
}

function onLectureRoomIntent(intent, callback) {
    'use strict';
    if (intent.slots.hasOwnProperty('lectureName')) {
        lectureRoom(client,
            intent.slots.lectureName.value, function(err, result) {
            var res;
            if (err) {
                callback(err, null);
                return;
            }
            res = response.say(result).build();
            callback(null, res);
        });
    }
}

function onLectureDateIntent(intent, callback) {
    'use strict';
    if (intent.slots.hasOwnProperty('lectureName')) {
        lectureDate(client,
            intent.slots.lectureName.value, function(err, result) {
            var res;
            if (err) {
                callback(err, null);
                return;
            }
            res = response.say(result).build();
            callback(null, res);
        });
    }
}

function onEctsIntent(intent, callback) {
    'use strict';
    if (intent.slots.hasOwnProperty('lectureName')) {
        ects(client,
            intent.slots.lectureName.value, function(err, result) {
                var res;
                if (err) {
                    callback(err, null);
                    return;
                }
                res = response.say(result).build();
                callback(null, res);
            });
    }
}

function onOfficeIntent(intent, callback) {
    'use strict';
    if (intent.slots.hasOwnProperty('query')) {
        office(client, intent.slots.query.value, function(err, result) {
            var res;
            if (err) {
                callback(err, null);
                return;
            }
            res = response.say(result).build();
            callback(null, res);
        });
    }
}

function onOfficeHoursIntent(intent, callback) {
    'use strict';
    if (intent.slots.hasOwnProperty('query')) {
        officeHours(client, intent.slots.query.value, function(err, result) {
            var res;
            if (err) {
                callback(err, null);
                return;
            }
            res = response.say(result).build();
            callback(null, res);
        });
    }
}

function onMenuIntent(intent, attributes, callback) {
    'use strict';
    var date, location, res, sbarNames;

    if (attributes && attributes.date) {
        date = attributes.date;
    } else if (intent.slots.date && intent.slots.date.value) {
        date = new Date(intent.slots.date.value);
    } else {
        date = new Date().setHours(0,0,0,0);
    }

    if (intent.slots.location && intent.slots.location.value) {
        location = intent.slots.location.value;
        sbarNames = ['essbar', 'hochschule'];
        if (_.contains(sbarNames, location.toLowerCase())) {
            location = 'S-Bar';
        }
        menu(client, location, date, function(err, result) {
            var res;
            if (err) {
                callback(err, null);
                return;
            }
            res = response.say(result).build();
            callback(null, res);
        });
    } else {
        res = response
            .ask('Willst du in der Mensa oder an der Hochschule essen?')
            .attributes({date: date})
            .build();
        callback(null, res);
    }
}

function onHelpIntent(done) {
    'use strict';
    var res = response.say('Du kannst mir folgende Fragen stellen: ' +
        'Was gibt es {Datum} in der {Hochschule oder Mensa} zu essen? ' +
        'Wo ist das Büro von Herr oder Frau {Name des Professors}? ' +
        'Wann hat Professor {Name des Professors} Sprechstunde? ' +
        'Wo findet die Vorlesung {Name der Vorlesung} statt? ' +
        'Wann findet die Vorlesung {Name der Vorlesung} statt? ' +
        'Wie viele E C T S gibt es für den Kurs {Name der Vorlesung}?')
        .build();
    done(null, res);
}

function onStopIntent(done) {
    'use strict';
    var res = response.say('Na gut')
        .build();
    done(null, res);
}

function forwardException(done) {
    'use strict';
    var res = response.say('Tut mir Leid, da ist etwas schief gelaufen.')
        .build();
    done(null, res);
}

exports.handler = function(event, context, callback) {
    'use strict';
    var msg;
    if (!appIdIsValid(event)) {
        msg = 'The request doesn\'t provide a valid application id';
        callback(new Error(msg), null);
    } else if (event.request.type === 'LaunchRequest') {
        onLaunch(callback);
    } else if (event.request.type === 'IntentRequest') {
        onIntent(event.request.intent, event.session.attributes, callback);
    }
};

function appIdIsValid(event) {
    'use strict';
    var reqAppId = event.session.application.applicationId;
    var actualAppId = process.env.ALEXA_APP_ID;
    return reqAppId === actualAppId;
}