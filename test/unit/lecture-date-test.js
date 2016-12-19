var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('../utils');
var sandbox = sinon.sandbox.create();
var lecture = require('../../lib/lecture');

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

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #lectureDate', function() {
        expect(lecture.date).to.be.a('function');
    });

    it('should call client', function() {
        utils.testThatFunctionCallsSearchDetails(lecture.date);
    });

    it('should return answer if no lecture was found', function(done) {
        var expected = 'Ich habe keine Vorlesung mit diesem Namen gefunden.';
        var client = { searchDetails: sinon.stub().callsArgWith(2, null, []) };

        lecture.date(
            client, 'ML', utils.createTestCallback(null, expected, done));
    });

    it('should return answer for single lecture', function(done) {
        var client, expected, stub;
        expected = 'Machine-Learning findet am Mittwoch von 11:45-13:15 ' +
            'und Mittwoch von 14:15-15:45 statt';
        stub = sinon.stub().callsArgWith(2, null, lectureDateSingleData);
        client = { searchDetails: stub};
        lecture.date(
            client, 'ML', utils.createTestCallback(null, expected, done));
    });

    it('should return answer for multiple lectures with empty date entries',
        function(done) {
            var expected, stub, client;
            expected = 'Ich habe 2 Vorlesungen gefunden: ' +
                'Machine-Learning findet am Mittwoch von 11:45-13:15' +
                ' und Mittwoch von 14:15-15:45 statt, Machine-Learning 2' +
                ' findet am Donnerstag von 11:45-13:15 und Dienstag' +
                ' von 14:15-15:45 statt';
            stub = sinon.stub()
                .callsArgWith(2, null, lectureDateMultipleDataWithEmptyDate);
            client = { searchDetails:  stub};
            lecture.date(
                client, 'ML', utils.createTestCallback(null, expected, done));
        });

    it('should provide error if client throws one', function(done) {
        utils.testIfFunctionForwardsSearchDetailsError(lecture.date, done);
    });
});