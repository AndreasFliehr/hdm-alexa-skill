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
            var stub, callback, intent;
            intent = utils.createMenuIntent(['location'], ['S-Bar']);
            stub = sandbox.stub().callsArgWith(2, 'Test Error', null);
            module.__set__('menu', stub);
            callback = utils.createTestCallback('Test Error', null, done);
            module.__get__('onIntent')(intent, callback);
        });

        it('should call callback with useful response', function(done) {
            var stub, callback, intent, expected;
            intent = utils.createMenuIntent(['location'], ['S-Bar']);

            expected = {
                version: '1.0',
                response: {
                    outputSpeech: {
                        type: 'PlainText',
                        text: 'Test Response'
                    },
                    shouldEndSession: true
                }
            };
            stub = sandbox.stub().callsArgWith(2, null, 'Test Response');
            module.__set__('menu', stub);
            callback = function(err, res) {
                expect(err).to.equal(null);
                expect(res).to.eql(expected);
                done();
            };
            module.__get__('onIntent')(intent, callback);
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
});