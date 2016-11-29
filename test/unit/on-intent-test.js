var rewire = require('rewire');
var module = rewire('../../');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var moduleBackup = module;
var utils = require('../utils/index');

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
            intent = utils.createIntent(
                'MenuIntent', ['date', 'location'], ['2016-11-18', 'S-Bar']);

            dateMatcher = createDateMatcher(new Date('2016-11-18'));
            testIfMenuIsCalledWithArgs(intent, 'S-Bar', dateMatcher);
        });

        it('should parse location if location is Essbar', function() {
            var intent, dateMatcher;
            intent = utils.createIntent(
                'MenuIntent', ['date', 'location'], ['2016-11-18', 'Essbar']);

            dateMatcher = createDateMatcher(new Date('2016-11-18'));
            testIfMenuIsCalledWithArgs(intent, 'S-Bar', dateMatcher);
        });

        it('should not call #menu if intent is not MenuIntent', function() {
            var intent = utils.createIntent([], []);
            testIfFnIsCalled('menu', intent, false);
        });

        it('should not call #menu if location slot is not present', function() {
            var intent = utils.createIntent(
                'MenuIntent', ['date'], ['2016-11-18']);

            testIfFnIsCalled('menu', intent, false);
        });

        it('should fallback to today\'s date', function() {
            var intent, dateMatcher;
            intent = utils.createIntent('MenuIntent', ['location'], ['S-Bar']);

            dateMatcher = createDateMatcher(new Date().setHours(0, 0, 0, 0));
            testIfMenuIsCalledWithArgs(intent, 'S-Bar', dateMatcher);
        });

        it('should forward error from menu intent', function(done) {
            var intent = utils.createIntent(
                'MenuIntent', ['location'], ['S-Bar']);
            testIfErrorIsForwarded(intent, 'menu', 2, done);
        });

        it('should call callback with response', function(done) {
            var intent = utils.createIntent(
                'MenuIntent', ['location'], ['S-Bar']);
            testResponse(intent, 'menu', 2, done);
        });
    });

    describe('OfficeIntent', function() {
        it('should call #office if intent is OfficeIntent', function() {
            var intent = utils.createIntent(
                'OfficeIntent', ['query'], ['thomas']);
            testIfOfficeIsCalledWithArgs(intent, 'thomas');
        });

        it('should not call office if intent is not OfficeIntent', function() {
            var intent = utils.createIntent(
                'OtherIntent', ['date', 'location'], ['2016-11-18', 'S-Bar']);
            testIfFnIsCalled('office', intent, false);
        });

        it('should not call office if query slot is not present', function() {
            var intent = utils.createIntent(
                'OfficeIntent', [], []);
            testIfFnIsCalled('office', intent, false);
        });

        it('should forward error from office intent to cb', function(done) {
            var intent = utils.createIntent('OfficeIntent', ['query'], ['Tom']);
            testIfErrorIsForwarded(intent, 'office', 1, done);
        });
        it('should call callback with response object', function(done) {
            var intent = utils.createIntent('OfficeIntent', ['query'], ['Tom']);
            testResponse(intent, 'office', 1, done);
        });
    });

    function testIfFnIsCalled(fn, intent, expected) {
        var spy = sandbox.spy();
        module.__set__(fn, spy);
        module.__get__('onIntent')(intent);
        expect(spy.called).to.equal(expected);
    }

    function createDateMatcher(date) {
        return function(value) {
            return value.valueOf() === date.valueOf();
        };
    }

    function testIfMenuIsCalledWithArgs(intent, location, dateMatcher) {
        var spy = sandbox.spy();
        module.__set__('menu', spy);
        module.__get__('onIntent')(intent, function() {});
        expect(spy.calledWith(
            location, sinon.match(dateMatcher), sinon.match.typeOf('function'))
        ).to.equal(true);
    }

    function testIfOfficeIsCalledWithArgs(intent, query) {
        var spy = sandbox.spy();
        module.__set__('office', spy);
        module.__get__('onIntent')(intent, function() {});
        expect(spy.calledWith(query, sinon.match.typeOf('function')))
            .to.equal(true);
    }

    function testIfErrorIsForwarded(intent, fn, argPos, done) {
        var stub, callback;
        stub = sandbox.stub().callsArgWith(argPos, 'Test Error', null);
        module.__set__(fn, stub);
        callback = utils.createTestCallback('Test Error', null, done);
        module.__get__('onIntent')(intent, callback);
    }

    function testResponse(intent, fn, argPos, done) {
        var stub, callback, expected;

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
        stub = sandbox.stub().callsArgWith(argPos, null, 'Test Response');
        module.__set__(fn, stub);
        callback = function(err, res) {
            expect(err).to.equal(null);
            expect(res).to.eql(expected);
            done();
        };
        module.__get__('onIntent')(intent, callback);
    }
});