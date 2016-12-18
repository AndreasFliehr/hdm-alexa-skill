var rewire = require('rewire');
var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('../utils/unitTest');
var sandbox = sinon.sandbox.create();

var lecture;

var lectureDateSingleData = [
    {
        date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
        name: 'Machine-Learning'
    }
];

var lectureDateMultipleDataWithEmptyDate = [
    {
        date: null,
        name: 'Machine-Learning'
    },
    {
        date: null,
        name: 'Machine-Learning'
    },
    {
        date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
        name: 'Machine-Learning'
    },
    {
        date: 'Do 11:45-13:15 \nDi 14:15-15:45',
        name: 'Machine-Learning 2'
    }
];

describe ('lectureDate', function() {
    'use strict';

    beforeEach(function() {
        lecture = rewire('../../lib/lecture');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #lectureDate', function() {
        expect(lecture.date).to.be.a('function');
    });

    it('should call client', function() {
        utils.shouldCallLectureClient(sandbox, lecture);
    });

    it('should return answer if no main was found', function(done) {
        var expected = 'Ich habe keine Vorlesung mit diesem Namen gefunden.';
        utils.testLectureResponse('invalid main', expected, [],
            sandbox, lecture, lecture.date, done);
    });

    it('should return answer for single main', function(done) {
        var expected = 'Machine-Learning findet am Mittwoch von 11:45-13:15 ' +
            'und Mittwoch von 14:15-15:45 statt';
        utils.testLectureResponse('Machine-Learning', expected,
            lectureDateSingleData, sandbox, lecture, lecture.date, done);
    });

    it('should return answer for multiple main ' +
        'with empty date entries', function(done) {
        var expected = 'Ich habe 2 Vorlesungen gefunden: ' +
            'Machine-Learning findet am Mittwoch von 11:45-13:15' +
            ' und Mittwoch von 14:15-15:45 statt, Machine-Learning 2' +
            ' findet am Donnerstag von 11:45-13:15 und Dienstag' +
            ' von 14:15-15:45 statt';
        utils.testLectureResponse('Machine-Learning', expected,
            lectureDateMultipleDataWithEmptyDate, sandbox,
            lecture, lecture.date, done);
    });

    it('should provide error if client throws one', function(done) {
        sandbox.stub(lecture.__get__('client'), 'searchDetails')
            .callsArgWith(2, new Error('Test Message'), null);
        lecture.date('Machine-Learning', function(err) {
            expect(err.message).to.equal('Test Message');
            done();
        });
    });
});