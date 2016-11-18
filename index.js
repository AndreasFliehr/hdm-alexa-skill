var response = require('alexa-response');
var menu = require('./lib/menu');

function onLaunch(done) {
    var res = response.ask('Willkommen an der HdM. Ich dir hiflreiche ' +
        'Informationen geben. Du kannst mich zum Beispiel fragen, wo deine ' +
        'Vorlesung stattfindet oder was es heute in der Mensa zu essen gibt. ' +
        'Wie kann ich dir helfen?')
        .reprompt('Frag mich zum Beispiel: Was gibt es heute in der Mensa?')
        .build();
    done(res);
}

function onIntent(intent) {
    var date;
    if (intent.slots.hasOwnProperty('date')) {
        date = new Date(intent.slots.date.value);
    } else {
        date = new Date().setHours(0,0,0,0);
    }
    if (intent.name === 'MenuIntent') {
        if (intent.slots.location) {
            menu(intent.slots.location.value, date, function() {
            });
        }
    }
}

exports.handler = function(event, context) {
    if (event.request.type === 'LaunchRequest') {
        onLaunch(context.succeed);
    }
};
