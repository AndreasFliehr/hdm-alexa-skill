var rewire = require('rewire');
var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('../utils');
var sandbox = sinon.sandbox.create();

var lecture;

var lectureRoomSingleData = [
    {
        date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
        name: 'System Engineering und Management',
        room: '141'
    }
];

var lectureRoomSingleDataWithMultipleRooms = [
    {
        date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
        name: 'Ultra Large Scale Systems',
        room: 'U31/U32'
    }
];

var lectureRoomMultipleDataWithEmptyAndMultipleRooms = [
    {
        date: null,
        name: 'Mediengestaltung I',
        room: 'U31/U32'
    },
    {
        date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
        name: 'Mediengestaltung II',
        room: null
    },
    {
        date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
        name: 'Mediengestaltung I',
        room: 'U31/U32'
    },
    {
        date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
        name: 'Mediengestaltung II',
        room: '214'
    }
];

describe('lectureRoom', function() {
    'use strict';

    beforeEach(function() {
        lecture = rewire('../../lib/lecture');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #lectureRoom', function() {
        expect(lecture.room).to.be.a('function');
    });

    it('should call client', function() {
        utils.testThatFunctionCallsSearchDetails(lecture.room);
    });

    it('should  answer for one lecture with one room',function(done) {
        var stub, client, expected;
        expected = 'System Engineering und Management findet ' +
            'in Raum 141 statt';
        stub = sinon.stub().callsArgWith(2, null, lectureRoomSingleData);
        client = { searchDetails: stub};
        lecture.room(
            client, 'ML', utils.createTestCallback(null, expected, done));
    });

    it('should answer for one lecture with multiple rooms', function(done) {
        var client, expected, stub;
        expected = 'Ultra Large Scale Systems findet in Raum U31 ' +
            'und in Raum U32 statt';
        stub = sinon.stub()
            .callsArgWith(2, null, lectureRoomSingleDataWithMultipleRooms);
        client = { searchDetails: stub};
        lecture.room(
            client, 'ML', utils.createTestCallback(null, expected, done));
    });

    it('should return answer for multiple lectures with single, multiple ' +
        'and empty rooms', function(done) {
        var client, stub, expected, apiResponse;
        expected = 'Ich habe 2 Vorlesungen gefunden: ' +
            'Mediengestaltung I findet in Raum U31 und ' +
            'in Raum U32 statt, Mediengestaltung II findet in Raum 214 statt';
        apiResponse = lectureRoomMultipleDataWithEmptyAndMultipleRooms;
        stub = sinon.stub().callsArgWith(2, null, apiResponse);
        client = { searchDetails: stub};
        lecture.room(
            client, 'ML', utils.createTestCallback(null, expected, done));
    });

    it('should return answer if no lecture was found', function(done) {
        var expected, stub, client;
        expected = 'Ich habe keine Vorlesung mit diesem Namen gefunden.';
        stub = sinon.stub().callsArgWith(2, null, []);
        client = { searchDetails: stub};
        lecture.room(
            client, 'ML', utils.createTestCallback(null, expected, done));
    });

    it('should provide error if client throws one', function(done) {
        utils.testIfFunctionForwardsSearchDetailsError(lecture.room, done);
    });
});