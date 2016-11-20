var expect = require('chai').expect;
var rewire = require('rewire');
var module = rewire('../');
var onLaunch = module.__get__('onLaunch');
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var moduleBackup = module;
var utils = require('./utils');

describe('event handler', function() {
    'use strict';

    beforeEach(function() {
        sandbox.restore();
        module = moduleBackup;
    });

    it('should expose function #handler', function() {
        var handler = module.handler;
        expect(handler).to.be.a('function');
    });

    it('should call #onLaunch if LaunchRequest', function() {
        testLaunchRequest(createEvent('LaunchRequest'), true);
    });

    it('should not call #onLaunch if no LaunchRequest', function() {
        testLaunchRequest(createEvent('IntentRequest'), false);
    });

    it('should call onIntent if IntentRequest', function() {
        var spy, event, cb;
        spy = createRequestSpy('onIntent');
        event = createEvent('IntentRequest');
        cb = function() {};
        module.handler(event, {}, cb);
        expect(spy.calledWithExactly(event.request.intent, cb))
            .to.equal(true);
    });

    it('should forward the response of #onLaunch', function(done) {
        var stub, event, callback;
        stub = sandbox.stub().callsArgWith(0, null, 'Test response');
        module.__set__('onLaunch', stub);
        event = createEvent('LaunchRequest');
        callback = utils.createTestCallback(null, 'Test response', done);
        module.handler(event, null, callback);
    });

    it('should forward the error of #onLaunch', function(done) {
        var stub, event, callback;
        stub = sandbox.stub().callsArgWith(0, 'Test Error', null);
        module.__set__('onLaunch', stub);
        event = createEvent('LaunchRequest');
        callback = utils.createTestCallback('Test Error', null, done);
        module.handler(event, null, callback);
    });

    it('should forward the error of #onIntent', function(done) {
        var stub, event, callback;
        stub = sandbox.stub().callsArgWith(1, 'Test Error', null);
        module.__set__('onIntent', stub);
        event = createEvent('IntentRequest');
        callback = utils.createTestCallback('Test Error', null, done);
        module.handler(event, null, callback);
    });
});

function createEvent(requestType) {
    'use strict';

    var event = {
        version: '1.0',
        request: {
            type: requestType,
            requestId: 'request.id.string',
            timestamp: 'string'
        }
    };

    if (requestType === 'IntentRequest') {
        event.request.intent = {
            name: 'Test Intent'
        };
    }

    return event;
}

function createRequestSpy(fn) {
    'use strict';

    var spy = sandbox.spy();
    module.__set__(fn, spy);
    return spy;

}

function testLaunchRequest(event, called) {
    'use strict';
    var spy = createRequestSpy('onLaunch');
    module.handler(event, context);
    expect(spy.called).to.equal(called);
}