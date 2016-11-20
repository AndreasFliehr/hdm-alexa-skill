var response = require('alexa-response');
var menu = require('./lib/menu');

function onLaunch(done) {
    'use strict';
    var res = response.ask('Willkommen an der HdM. Ich dir hiflreiche ' +
        'Informationen geben. Du kannst mich zum Beispiel fragen, wo deine ' +
        'Vorlesung stattfindet oder was es heute in der Mensa zu essen gibt. ' +
        'Wie kann ich dir helfen?')
        .reprompt('Frag mich zum Beispiel: Was gibt es heute in der Mensa?')
        .build();
    done(res);
}

function onIntent(intent) {
    'use strict';
    if (intent.name === 'MenuIntent') {
        onMenuIntent(intent);
    }
}

function onMenuIntent(intent) {
    'use strict';
    var date;
    if (intent.slots.location) {
        if (intent.slots.hasOwnProperty('date')) {
            date = new Date(intent.slots.date.value);
        } else {
            date = new Date().setHours(0,0,0,0);
        }
        menu(intent.slots.location.value, date, function() {
        });
    }
}

exports.handler = function(event, context) {
    'use strict';
    if (event.request.type === 'LaunchRequest') {
        onLaunch(context.succeed);
    } else if (event.request.type === 'IntentRequest') {
        onIntent(event.request.intent);
    }
};
