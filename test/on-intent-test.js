var rewire = require('rewire');
var module = rewire('../');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var moduleBackup = module;

describe('#onIntent', function() {
    'use strict';

    beforeEach(function() {
        sandbox.restore();
        module = moduleBackup;
    });
    it('should expose function #onIntent', function() {
        expect(module.__get__('onIntent')).to.be.a('function');
    });

    it('should call #menu if intent is MenuIntent', function() {
        var intent, dateMatcher;
        intent = {
            name: 'MenuIntent',
            slots: {
                date: {
                    name: 'date',
                    value: '2016-11-18'
                },
                location: {
                    name: 'location',
                    value: 'S-Bar'
                }
            }
        };
        dateMatcher = createDateMatcher(new Date('2016-11-18'));
        testIfMenuIsCalledWithArgs(intent,'S-Bar', dateMatcher);
    });

    it('should not call #menu if intent is not MenuIntent', function() {
        var intent = {
            name: 'OtherIntent',
            slots: {
                date: {},
                location: {}
            }
        };
        testIfMenuIsCalled(intent, false);
    });

    it('should not call #menu if location slot is not present', function() {
        var intent = {
            name: 'MenuIntent',
            slots: {
                date: {
                    name: 'date',
                    value: '2016-11-18'
                }
            }
        };
        testIfMenuIsCalled(intent, false);
    });

    it('should call #menu with today\'s date if none is specified', function() {
        var intent, dateMatcher;
        intent = {
            name: 'MenuIntent',
            slots: {
                location: {
                    name: 'location',
                    value: 'S-Bar'
                }
            }
        };
        dateMatcher = createDateMatcher(new Date().setHours(0,0,0,0));
        testIfMenuIsCalledWithArgs(intent, 'S-Bar', dateMatcher);
    });
});

function testIfMenuIsCalled(intent, expected) {
    'use strict';

    var spy = sandbox.spy();
    module.__set__('menu', spy);
    module.__get__('onIntent')(intent);
    expect(spy.calledOnce).to.equal(expected);
}

function createDateMatcher(date) {
    'use strict';

    return function(value) {
        return value.valueOf() === date.valueOf();
    };
}

function testIfMenuIsCalledWithArgs(intent, location, dateMatcher) {
    'use strict';

    var spy = sandbox.spy();
    module.__set__('menu', spy);
    module.__get__('onIntent')(intent);
    expect(spy.calledWith(
        location, sinon.match(dateMatcher), sinon.match.typeOf('function'))
    ).to.equal(true);
}