var rewire = require('rewire');
var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('../utils/unitTest');
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
        utils.shouldCallLectureClient(sandbox, lecture);
    });

    it('should return answer for single main with single room',
        function(done) {
        var expected = 'System Engineering und Management findet ' +
            'in Raum 141 statt';
        utils.testLectureResponse('System Engineering', expected,
            lectureRoomSingleData, sandbox, lecture, lecture.room,
            done);
    });

    it('should return answer for single main with multiple rooms',
        function(done) {
        var expected = 'Ultra Large Scale Systems findet in Raum U31 ' +
            'und in Raum U32 statt';
        utils.testLectureResponse('Ultra Large', expected,
            lectureRoomSingleDataWithMultipleRooms,
            sandbox, lecture, lecture.room, done);
    });

    it('should return answer for multiple lectures with single, multiple ' +
        'and empty rooms', function(done) {
        var expected = 'Ich habe 2 Vorlesungen gefunden: ' +
            'Mediengestaltung I findet in Raum U31 und ' +
            'in Raum U32 statt, Mediengestaltung II findet in Raum 214 statt';
        utils.testLectureResponse('Mediengestaltung', expected,
            lectureRoomMultipleDataWithEmptyAndMultipleRooms,
            sandbox, lecture, lecture.room, done);
    });

    it('should return answer if no main was found', function(done) {
        var expected = 'Ich habe keine Vorlesung mit diesem Namen gefunden.';
        utils.testLectureResponse('invalid main', expected, [],
            sandbox, lecture, lecture.room, done);
    });

    it('should provide error if client throws one', function(done) {
        utils.shouldProvideLectureError(sandbox, lecture.room, done);
    });
});