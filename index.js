var response = require('alexa-response');

function onLaunch(done) {
    var res = response.ask('Willkommen an der HdM. Ich dir hiflreiche Informationen geben. Du kannst mich ' +
            'zum Beispiel fragen, wo deine Vorlesung stattfindet oder was es heute in der Mensa zu essen ' +
            'gibt. Wie kann ich dir helfen?')
        .reprompt('Frag mich zum Beispiel: Was gibt es heute in der Mensa?')
        .build();
    done(null, res);
}
