var rewire = require('rewire');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var lectureRoom;

var lectureRoomSingleData = [
    {
        name: 'System Engineering und Management',
        room: '141'
    }
];

var lectureRoomSingleDataMultipleRooms = [
    {
        name: 'Ultra Large Scale Systems',
        room: 'U31/U32'
    }
];

describe('lectureRoom', function() {
    'use strict';

    beforeEach(function() {
        lectureRoom = rewire('../../lib/lectureRoom');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #lectureRoom', function() {
        expect(lectureRoom).to.be.a('function');
    });

    it('should call client', function(done) {
        var searchDetailsSpy = sandbox.spy();
        lectureRoom.__set__('client', {searchDetails: searchDetailsSpy});
        expect(searchDetailsSpy.calledWithExactly(
            'System Engineering', done()));
    });

    it('should return answer for single lecture and single room',
        function(done) {
        var expected = 'System Engineering und Management findet ' +
            'in Raum 141 statt.';
        testResponse('System Engineering', expected,
            lectureRoomSingleData, done);
    });

    it('should return answer for single lecture and multiple rooms',
        function(done) {
        var expected = 'Ultra Large Scale Systems findet in Raum U31 ' +
            'und in Raum U32 statt.';
        testResponse('Ultra Large', expected,
            lectureRoomSingleDataMultipleRooms, done);
    });
});

function testResponse(lecture, expected, dataMock, done) {
    'use strict';

    sandbox.stub(lectureRoom.__get__('client'), 'searchDetails')
        .callsArgWith(2, null, dataMock);

    lectureRoom(lecture, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
}