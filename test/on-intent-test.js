var rewire = require('rewire');
var module = rewire('../');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var moduleBackup = module;
var utils = require('./utils');

describe('#onIntent', function() {
    'use strict';

    beforeEach(function() {
        sandbox.restore();
        module = moduleBackup;
    });

    it('should expose function #onIntent', function() {
        expect(module.__get__('onIntent')).to.be.a('function');
    });

    describe('MenuIntent', function() {

        it('should call #menu if intent is MenuIntent', function() {
            var intent, dateMatcher;
            intent = utils.createMenuIntent(
                ['date', 'location'], ['2016-11-18', 'S-Bar']);

            dateMatcher = createDateMatcher(new Date('2016-11-18'));
            testIfMenuIsCalledWithArgs(intent, 'S-Bar', dateMatcher);
        });

        it('should not call #menu if intent is not MenuIntent', function() {
            var intent = utils.createMenuIntent([], []);
            testIfMenuIsCalled(intent, false);
        });

        it('should not call #menu if location slot is not present', function() {
            var intent = utils.createMenuIntent(['date'], ['2016-11-18']);

            testIfMenuIsCalled(intent, false);
        });

        it('should fallback to today\'s date', function() {
            var intent, dateMatcher;
            intent = utils.createMenuIntent(['location'], ['S-Bar']);

            dateMatcher = createDateMatcher(new Date().setHours(0, 0, 0, 0));
            testIfMenuIsCalledWithArgs(intent, 'S-Bar', dateMatcher);
        });

        it('should forward error from menu intent', function(done) {
            testIfResponseIsForwardedToCallback('Test Error', null, done);
        });

        it('should call forward response from menu intent', function(done) {
            testIfResponseIsForwardedToCallback(null, 'Test Response', done);
        });
    });

    function testIfMenuIsCalled(intent, expected) {
        var spy = sandbox.spy();
        module.__set__('menu', spy);
        module.__get__('onIntent')(intent);
        expect(spy.calledOnce).to.equal(expected);
    }

    function createDateMatcher(date) {
        return function(value) {
            return value.valueOf() === date.valueOf();
        };
    }

    function testIfMenuIsCalledWithArgs(intent, location, dateMatcher) {
        var spy = sandbox.spy();
        module.__set__('menu', spy);
        module.__get__('onIntent')(intent, function() {
        });
        expect(spy.calledWith(
            location, sinon.match(dateMatcher), sinon.match.typeOf('function'))
        ).to.equal(true);
    }

    function testIfResponseIsForwardedToCallback(error, response, done) {
        var stub, callback, intent;
        intent = utils.createMenuIntent(['location'], ['S-Bar']);

        stub = sandbox.stub().callsArgWith(2, error, response);
        module.__set__('menu', stub);
        callback = utils.createTestCallback(error, response, done);
        module.__get__('onIntent')(intent, callback);
    }
});