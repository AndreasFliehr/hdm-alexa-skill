var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('../utils');
var lecture = require('../../lib/lecture');

var lectureRoomSingleDataOneRoomAndOneDate = [
    {
        date: 'Mo 08:15-09:45',
        name: 'Agiles Projekt-Management',
        room: '204'
    }
];

var lectureRoomSingleDataOneRoomAndMultipleDates = [
    {
        date: 'Do 16:00-17:30 \nDo 17:45-19:15',
        name: 'System Engineering und Management',
        room: '141'
    }
];

var lectureRoomSingleDataMultipleRoomsAndMultipleDates = [
    {
        date: 'Do 14:15-15:45 \nFr 08:15-09:45',
        name: 'Ultra Large Scale Systems',
        room: 'U31/U32'
    }
];

var lectureRoomMultipleDataWithEmptyAndMultipleRooms = [
    {
        date: null,
        name: 'Mediengestaltung I',
        room: null
    },
    {
        date: null,
        name: 'Mediengestaltung II',
        room: null
    },
    {
        date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
        name: 'Mediengestaltung I',
        room: 'U31/U32'
    },
    {
        date: 'Mi 11:45-13:15',
        name: 'Mediengestaltung II',
        room: '214'
    }
];

describe('lectureRoom', function() {
    'use strict';

    before(function() {
        process.env.MAX_RESULTS = 324;
    });

    it('should be a function #lectureRoom', function() {
        expect(lecture.room).to.be.a('function');
    });

    it('should call client', function() {
        utils.testThatFunctionCallsSearchDetails(lecture.room);
    });

    it('should answer for one lecture with one room and one date',
        function(done) {
            var stub, client, expected;
            expected = 'Agiles Projekt-Management findet am Montag ' +
                'von 08:15-09:45 in Raum 204 statt';
            stub = sinon.stub().callsArgWith(3, null,
                lectureRoomSingleDataOneRoomAndOneDate);
            client = { searchDetails: stub};
            lecture.room(
                client, 'ML', utils.createTestCallback(null, expected, done));
        });

    it('should answer for one lecture with one room and multiple dates',
        function(done) {
            var stub, client, expected;
            expected = 'System Engineering und Management findet am ' +
                'Donnerstag von 16:00-17:30 und Donnerstag von 17:45-19:15 ' +
                'in Raum 141 statt';
            stub = sinon.stub().callsArgWith(3, null,
                lectureRoomSingleDataOneRoomAndMultipleDates);
            client = { searchDetails: stub};
            lecture.room(
                client, 'ML', utils.createTestCallback(null, expected, done));
        });

    it('should answer for one lecture with multiple rooms ' +
        'and multiple dates', function(done) {
            var client, expected, stub, apiResponse;
            expected = 'Ultra Large Scale Systems findet am Donnerstag ' +
                'von 14:15-15:45 in Raum U31 und Freitag von ' +
                '08:15-09:45 in Raum U32 statt';
            apiResponse = lectureRoomSingleDataMultipleRoomsAndMultipleDates;
            stub = sinon.stub()
                .callsArgWith(3, null, apiResponse);
            client = { searchDetails: stub};
            lecture.room(
                client, 'ML', utils.createTestCallback(null, expected, done));
        });

    it('should return answer for multiple lectures with single, multiple ' +
        'and empty rooms connected to dates', function(done) {
            var client, stub, expected, apiResponse;
            expected = 'Ich habe 2 Vorlesungen gefunden: ' +
                'Mediengestaltung I findet am Mittwoch von 11:45-13:15 ' +
                'in Raum U31 und Mittwoch von 14:15-15:45 in Raum U32 statt, ' +
                'Mediengestaltung II findet am Mittwoch von 11:45-13:15 ' +
                'in Raum 214 statt';
            apiResponse = lectureRoomMultipleDataWithEmptyAndMultipleRooms;
            stub = sinon.stub().callsArgWith(3, null, apiResponse);
            client = { searchDetails: stub};
            lecture.room(
                client, 'ML', utils.createTestCallback(null, expected, done));
        });

    it('should return answer if no lecture was found', function(done) {
        var expected, stub, client;
        expected = 'Ich habe keine Vorlesung mit diesem Namen gefunden.';
        stub = sinon.stub().callsArgWith(3, null, []);
        client = { searchDetails: stub};
        lecture.room(
            client, 'ML', utils.createTestCallback(null, expected, done));
    });

    it('should provide error if client throws one', function(done) {
        utils.testIfFunctionForwardsSearchDetailsError(lecture.room, done);
    });
});
