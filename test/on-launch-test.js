var expect = require('chai').expect;
var rewire = require('rewire');
var module = rewire('../');
var onLaunch = module.__get__('onLaunch');

describe('#onLaunch', function() {
    'use strict';

    it('has function #onLaunch', function() {
        expect(onLaunch).to.be.a('function');
    });

    it('should build welcome response', function(done) {
        var expected = {
            version: '1.0',
            response: {
                outputSpeech: {
                    type: 'PlainText',
                    text: 'Willkommen an der HdM. Ich kann dir hilfreiche ' +
                          'Informationen geben. Du kannst mich zum Beispiel ' +
                          'fragen, wo deine Vorlesung stattfindet oder was ' +
                          'es heute in der Mensa zu essen gibt. Wie kann ' +
                          'ich dir helfen?'
                },
                reprompt: {
                    outputSpeech: {
                        type: 'PlainText',
                        text: 'Frag mich zum Beispiel: Was gibt es heute ' +
                              'in der Mensa?'
                    }
                },
                shouldEndSession: false
            }
        };

        onLaunch(function(err, response) {
            expect(err).to.equal(null);
            expect(response).to.eql(expected);
            done();
        });
    });
});