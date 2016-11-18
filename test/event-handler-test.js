var expect = require('chai').expect;
var rewire = require('rewire');
var module = rewire('../');
var onLaunch = module.__get__('onLaunch');
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var moduleBackup = module;

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
});

function createEvent(requestType) {
    'use strict';

    return {
        version: '1.0',
        request: {
            type: requestType,
            requestId: 'request.id.string',
            timestamp: 'string'
        }
    };
}

function testLaunchRequest(event, onLaunchShouldBeCalled) {
    'use strict';

    var spy, context;
    spy = sandbox.spy();
    module.__set__('onLaunch', spy);
    context = {};
    context.succeed = function() {};
    module.handler(event, context);
    expect(spy.called).to.equal(onLaunchShouldBeCalled);
}