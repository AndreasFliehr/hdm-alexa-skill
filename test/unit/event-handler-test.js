var expect = require('chai').expect;
var rewire = require('rewire');
var sinon = require('sinon');
var utils = require('../utils/index');
var module;
var skillClient = require('alexa-skills-kit-client');
var validId = 'secret:id';
var invalidId = 'wrong:id';

describe('event handler', function() {
    'use strict';

    beforeEach(function() {
        module = rewire('../../');
        process.env.ALEXA_APP_ID = validId;
    });

    it('should expose function #handler', function() {
        var handler = module.handler;
        expect(handler).to.be.a('function');
    });

    it('should call #onLaunch if LaunchRequest', function() {
        testLaunchRequest(createLaunchRequest(), true);
    });

    it('should not call #onLaunch if no LaunchRequest', function() {
        testLaunchRequest(createIntentRequest(), false);
    });

    it('should call onIntent if IntentRequest', function() {
        var spy, request, cb;
        spy = createRequestSpy('onIntent');
        request = createIntentRequest();
        request.session.attributes = 'Test';
        cb = function() {};
        module.handler(request, {}, cb);
        expect(spy.calledWithExactly(request.request.intent, 'Test', cb))
            .to.equal(true);
    });

    it('should forward the response of #onLaunch', function(done) {
        var stub, request, callback;
        stub = sinon.stub().callsArgWith(0, null, 'Test response');
        module.__set__('onLaunch', stub);
        request = createLaunchRequest();
        callback = utils.createTestCallback(null, 'Test response', done);
        module.handler(request, null, callback);
    });

    it('should forward the error of #onLaunch', function(done) {
        var stub, request, callback;
        stub = sinon.stub().callsArgWith(0, 'Test Error', null);
        module.__set__('onLaunch', stub);
        request = createLaunchRequest();
        callback = utils.createTestCallback('Test Error', null, done);
        module.handler(request, null, callback);
    });

    it('should forward the error of #onIntent', function(done) {
        var stub, request, callback;
        stub = sinon.stub().callsArgWith(2, 'Test Error', null);
        module.__set__('onIntent', stub);
        request = createIntentRequest();
        callback = utils.createTestCallback('Test Error', null, done);
        module.handler(request, null, callback);
    });

    it('should not call #onIntent if app id is wrong', function() {
        var spy = createRequestSpy('onIntent');
        var request = createLaunchRequest(invalidId);
        module.handler(request, null, function() {});
        expect(spy.called).to.equal(false);
    });

    it('should provide error if appId is wrong', function(done) {
        var msg = 'The request doesn\'t provide a valid application id';
        var request = createLaunchRequest(invalidId);
        module.handler(request, null, function(err, response) {
            expect(err.message).to.equal(msg);
            expect(response).to.equal(null);
            done();
        });
    });
});

function createIntentRequest(appId) {
    'use strict';

    var request = skillClient.intent('MenuIntent', {});
    request.session.application.applicationId = appId || validId;
    return request;
}

function createLaunchRequest(appId) {
    'use strict';

    var request = skillClient.launch();
    request.session.application.applicationId = appId || validId;
    return request;
}

function createRequestSpy(fn) {
    'use strict';

    var spy = sinon.spy();
    module.__set__(fn, spy);
    return spy;

}

function testLaunchRequest(request, called) {
    'use strict';
    var spy = createRequestSpy('onLaunch');
    module.handler(request, context);
    expect(spy.called).to.equal(called);
}