var rewire = require('rewire');
var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('../utils/unitTest');
var sandbox = sinon.sandbox.create();

var lecture;

var ectsSingleData = [
    {
        date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
        name: 'Machine-Learning',
        ects: 6
    }
];

var ectsMultipleDataWithEmptyDate = [
    {
        date: null,
        ects: 5,
        name: 'Machine-Learning'
    },
    {
        date: null,
        ects: 4,
        name: 'Machine-Learning'
    },
    {
        date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
        ects: 6,
        name: 'Machine-Learning'
    },
    {
        date: 'Do 11:45-13:15 \nDi 14:15-15:45',
        ects: 7,
        name: 'Machine-Learning 2'
    }
];

describe ('ects', function() {
    'use strict';

    beforeEach(function() {
        lecture = rewire('../../lib/lecture');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #lectureDate', function() {
        expect(lecture.ects).to.be.a('function');
    });

    it('should call client', function() {
        var searchDetailsSpy, fnMatcher, expectation;
        searchDetailsSpy = sandbox.spy();
        fnMatcher = sinon.match.typeOf('function');
        lecture.__set__('client', {searchDetails: searchDetailsSpy});
        lecture.ects('Machine-Learning', function() {});
        expectation = searchDetailsSpy
            .calledWithExactly('lecture', 'Machine-Learning', fnMatcher);
        expect(expectation).to.equal(true);
    });

    it('should return answer if no main was found', function(done) {
        var expected = 'Ich habe keine Vorlesung mit diesem Namen gefunden.';
        utils.testLectureResponse('invalid main', expected, [],
            sandbox, lecture, lecture.ects, done);
    });

    it('should return answer for single main', function(done) {
        var expected = 'Machine-Learning hat 6 ECTS';
        utils.testLectureResponse('Machine-Learning', expected, ectsSingleData,
            sandbox, lecture, lecture.ects, done);
    });

    it('should return answer for multiple main ' +
        'with empty date entries', function(done) {
        var expected = 'Ich habe 2 Vorlesungen gefunden: ' +
            'Machine-Learning hat 6 ECTS, Machine-Learning 2' +
            ' hat 7 ECTS';
        utils.testLectureResponse('Machine-Learning', expected,
            ectsMultipleDataWithEmptyDate, sandbox,
            lecture, lecture.ects, done);
    });

    it('should provide error if client throws one', function(done) {
        sandbox.stub(lecture.__get__('client'), 'searchDetails')
            .callsArgWith(2, new Error('Test Message'), null);
        lecture.ects('Machine-Learning', function(err) {
            expect(err.message).to.equal('Test Message');
            done();
        });
    });
});