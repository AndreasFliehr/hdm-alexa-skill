var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('../utils');
var sandbox = sinon.sandbox.create();
var lecture = require('../../lib/lecture');

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

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #lectureDate', function() {
        expect(lecture.ects).to.be.a('function');
    });

    it('should call client', function() {
        utils.testThatFunctionCallsSearchDetails(lecture.ects);
    });

    it('should return answer if no main was found', function(done) {
        var expected = 'Ich habe keine Vorlesung mit diesem Namen gefunden.';

        var client = { searchDetails: sinon.stub().callsArgWith(2, null, []) };

        lecture.ects(
            client, 'Baking', utils.createTestCallback(null, expected, done));
    });

    it('should return answer for single main', function(done) {
        var expected = 'Machine-Learning hat 6 ECTS';
        var stub = sinon.stub().callsArgWith(2, null, ectsSingleData);
        var client = { searchDetails: stub };

        lecture.ects(
            client, 'ML', utils.createTestCallback(null, expected, done));
    });

    it('should return answer for multiple main ' +
        'with empty date entries', function(done) {
        var expected = 'Ich habe 2 Vorlesungen gefunden: ' +
            'Machine-Learning hat 6 ECTS, Machine-Learning 2' +
            ' hat 7 ECTS';
        var stub = sinon.stub()
            .callsArgWith(2, null, ectsMultipleDataWithEmptyDate);
        var client = { searchDetails: stub };

        lecture.ects(
            client, 'ML', utils.createTestCallback(null, expected, done));
    });
    it('should provide error if client throws one', function(done) {
        utils.testIfFunctionForwardsSearchDetailsError(lecture.ects, done);
    });
});