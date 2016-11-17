var expect = require('chai').expect;
var rewire = require('rewire');
var module = rewire('../');
var onLaunch = module.__get__('onLaunch');
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var module_backup = module;         // is used to reset module after injecting test objects

describe('Launch Request', function () {
    beforeEach(function () {
        sandbox.restore();
        module = module_backup;
    });

    it('has function #onLaunch', function () {
        expect(onLaunch).to.be.a('function');
    });

    it('should build welcome response', function (done) {
        var expected = {
            version: '1.0',
            response: {
                outputSpeech: {
                    type: "PlainText",
                    text: 'Willkommen an der HdM. Ich dir hiflreiche Informationen geben. Du kannst mich ' +
                    'zum Beispiel fragen, wo deine Vorlesung stattfindet oder was es heute in der Mensa zu essen ' +
                    'gibt. Wie kann ich dir helfen?'
                },
                reprompt: {
                    outputSpeech: {
                        type: "PlainText",
                        text: 'Frag mich zum Beispiel: Was gibt es heute in der Mensa?'
                    }
                },
                shouldEndSession: false
            }
        };

        onLaunch(function (err, response) {
            expect(response).to.eql(expected);
            done();
        })
    });

    it('should expose function #handler', function () {
        var handler = module.handler;
        expect(handler).to.be.a('function');
    });

    it('should call #context.succeed for launch request', function (done) {
        var context = {
            succeed: done
        };
        module.handler(createEvent('LaunchRequest'), context);
    });

    it('should call #onLaunch if LaunchRequest', function () {
        testLaunchRequest(createEvent('LaunchRequest'), true)
    });

    it('should not call #onLaunch if no LaunchRequest', function () {
        testLaunchRequest(createEvent('IntentRequest'), false);
    })
});

function createEvent(requestType) {
    return {
        version: "1.0",
        "request": {
            "type": requestType,
            "requestId": "request.id.string",
            "timestamp": "string"
        }
    }
}

function testLaunchRequest(event, onLaunchShouldBeCalled) {
    var spy, context;
    spy = sandbox.spy();
    module.__set__('onLaunch', spy);
    context = {};
    context.succeed = function () {};
    module.handler(event, context);
    expect(spy.called).to.equal(onLaunchShouldBeCalled);
}