var rewire = require('rewire');
var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('../utils/index');
var response = require('alexa-response');
var module;

describe('#onIntent', function() {
    'use strict';

    beforeEach(function() {
        module = rewire('../../');
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
            testIfMenuIsCalledWithArgs(intent, {}, 'S-Bar', dateMatcher);
        });

        it('should parse location if location is Essbar', function() {
            var intent, dateMatcher;
            intent = utils.createIntent(
                'MenuIntent', ['date', 'location'], ['2016-11-18', 'Essbar']);

            dateMatcher = createDateMatcher(new Date('2016-11-18'));
            testIfMenuIsCalledWithArgs(intent, {}, 'S-Bar', dateMatcher);
        });

        it('should parse location if location is essbar', function() {
            var intent, dateMatcher;
            intent = utils.createIntent(
                'MenuIntent', ['date', 'location'], ['2016-11-18', 'essbar']);

            dateMatcher = createDateMatcher(new Date('2016-11-18'));
            testIfMenuIsCalledWithArgs(intent, {}, 'S-Bar', dateMatcher);
        });

        it('should parse location if location is hochschule', function() {
            var intent, dateMatcher;
            intent = utils.createIntent(
                'MenuIntent', ['date', 'location'], ['2016-11-18', 'hochschule']
            );

            dateMatcher = createDateMatcher(new Date('2016-11-18'));
            testIfMenuIsCalledWithArgs(intent, {}, 'S-Bar', dateMatcher);
        });

        it('should not call #menu if intent is not MenuIntent', function() {
            var intent = utils.createIntent([], []);
            testIfFnIsCalled('menu', intent, {}, false);
        });

        it('should not call #menu if location slot is not present', function() {
            var intent = utils.createIntent(
                'MenuIntent', ['date'], ['2016-11-18']);

            testIfFnIsCalled('menu', intent, {}, false);
        });

        it('should not call #menu if location slot is empty', function() {
            var intent = utils.createIntent(
                'MenuIntent', ['date', 'location'], ['2016-11-18', null]);

            testIfFnIsCalled('menu', intent, {}, false);
        });

        it('should use date from attributes if present', function() {
            var spy, attributes, intent, date;
            spy = sinon.spy();
            intent = utils.createIntent('MenuIntent', ['location'], ['Mensa']);
            date = new Date('2016-11-18');
            attributes = {date: date};
            module.__set__('menu', spy);
            module.__get__('onIntent')(intent, attributes);
            expect(spy.calledWith(sinon.match.any, date))
                .to.equal(true);
        });

        it('should not throw any error if attributes is null', function(done) {
            var intent;
            intent = utils.createIntent('MenuIntent', ['location'], ['Mensa']);
            module.__set__('menu', sinon.stub().callsArg(2));
            module.__get__('onIntent')(intent, null, function() {
                done();
            });
        });

        it('should fallback to today\'s date if no date slot', function() {
            var intent, dateMatcher;
            intent = utils.createIntent('MenuIntent', ['location'], ['S-Bar']);

            dateMatcher = createDateMatcher(new Date().setHours(0, 0, 0, 0));
            testIfMenuIsCalledWithArgs(intent, {}, 'S-Bar', dateMatcher);
        });

        it('should fallback to today\'s date if no date value', function() {
            var intent, dateMatcher;
            intent = utils.createIntent(
                'MenuIntent', ['location', 'date'], ['S-Bar', null]);

            dateMatcher = createDateMatcher(new Date().setHours(0, 0, 0, 0));
            testIfMenuIsCalledWithArgs(intent, {}, 'S-Bar', dateMatcher);
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

        it('should ask for location if none is provided', function(done) {
            var intent, question, attributes, expected;

            question = 'Willst du in der Mensa oder in der Hochschule essen?';
            attributes = {date: new Date('2016-11-18')};
            expected = response.ask(question).attributes(attributes).build();
            intent = utils.createIntent(
                'MenuIntent', ['date'], ['2016-11-18']);

            module.__get__('onIntent')(intent, {}, function(err, res) {
                expect(err).to.equal(null);
                expect(res).to.eql(expected);
                done();
            });
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
            testIfFnIsCalled('office', intent, null, false);
        });

        it('should not call office if query slot is not present', function() {
            var intent = utils.createIntent(
                'OfficeIntent', [], []);
            testIfFnIsCalled('office', intent, null, false);
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

    describe('LectureDateIntent', function() {
        it('should call #lectureDate if intent is LectureDateIntent',
            function() {
            var intent = utils.createIntent(
                'LectureDateIntent', ['query'], ['Machine-Learning']);
            testIfLectureDateIsCalledWithArgs(intent, 'Machine-Learning');
        });

        it('should not call #lectureDate if intent is not LectureDateIntent',
            function() {
                var intent = utils.createIntent(
                    'OtherIntent', ['query'], ['Machine-Learning']);
                testIfFnIsCalled('lectureDate', intent, null, false);
            });
        it('should not call #lectureDate if query slot is not present',
            function() {
            var intent = utils.createIntent(
                'LectureDateIntent', [], []);
            testIfFnIsCalled('lectureDate', intent, null, false);
        });

        it('should forward error from #lectureDate intent to cb',
            function(done) {
            var intent = utils.createIntent(
                'LectureDateIntent', ['query'], ['Machine-Learning']);
            testIfErrorIsForwarded(intent, 'lectureDate', 1, done);
        });

        it('should call callback with response object', function(done) {
            var intent = utils.createIntent(
                'LectureDateIntent', ['query'], ['Machine-Learning']);
            testResponse(intent, 'lectureDate', 1, done);
        });
    });

    describe('LectureRoomIntent', function() {
        it('should call #lectureRoom if intent is LectureRoomIntent',
            function() {
                var intent = utils.createIntent(
                    'LectureRoomIntent', ['query'], ['Machine-Learning']);
                testIfLectureRoomIsCalledWithArgs(intent, 'Machine-Learning');
            });

        it('should not call #lectureRoom if intent is not LectureRoomIntent',
            function() {
            var intent = utils.createIntent(
                'OtherIntent', ['query'], ['Machine-Learning']);
            testIfFnIsCalled('lectureRoom', intent, null, false);
        });

    });

    function testIfLectureRoomIsCalledWithArgs(intent, query) {
        var spy = sinon.spy();
        module.__set__('lectureRoom', spy);
        module.__get__('onIntent')(intent, function() {});
        expect(spy.calledWith(query, sinon.match.typeOf('function')))
            .to.equal(true);
    }

    function testIfLectureDateIsCalledWithArgs(intent, query) {
        var spy = sinon.spy();
        module.__set__('lectureDate', spy);
        module.__get__('onIntent')(intent, function() {});
        expect(spy.calledWith(query, sinon.match.typeOf('function')))
            .to.equal(true);
    }

    function testIfFnIsCalled(fn, intent, attributes, expected) {
        var spy = sinon.spy();
        module.__set__(fn, spy);
        module.__get__('onIntent')(intent, attributes, function() {});
        expect(spy.called).to.equal(expected);
    }

    function createDateMatcher(date) {
        return function(value) {
            return value.valueOf() === date.valueOf();
        };
    }

    function testIfMenuIsCalledWithArgs(intent, attr, location, dateMatcher) {
        var spy = sinon.spy();
        module.__set__('menu', spy);
        module.__get__('onIntent')(intent, attr, function() {});
        expect(spy.calledWithExactly(
            location, sinon.match(dateMatcher), sinon.match.typeOf('function'))
        ).to.equal(true);
    }

    function testIfOfficeIsCalledWithArgs(intent, query) {
        var spy = sinon.spy();
        module.__set__('office', spy);
        module.__get__('onIntent')(intent, function() {});
        expect(spy.calledWith(query, sinon.match.typeOf('function')))
            .to.equal(true);
    }

    function testIfErrorIsForwarded(intent, fn, argPos, done) {
        var stub, callback;
        stub = sinon.stub().callsArgWith(argPos, 'Test Error', null);
        module.__set__(fn, stub);
        callback = utils.createTestCallback('Test Error', null, done);
        module.__get__('onIntent')(intent, {}, callback);
    }

    function testResponse(intent, fn, argPos, done) {
        var stub, callback, expected;
        expected = response.say('Test Response').build();
        stub = sinon.stub().callsArgWith(argPos, null, 'Test Response');
        module.__set__(fn, stub);
        callback = function(err, res) {
            expect(err).to.equal(null);
            expect(res).to.eql(expected);
            done();
        };
        module.__get__('onIntent')(intent, {}, callback);
    }
});

