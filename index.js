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

function onIntent() {
    menu();
}

exports.handler = function(event, context) {
    if (event.request.type === 'LaunchRequest') {
        onLaunch(context.succeed);
    }
};