var rewire = require('rewire');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var ects;

var ectsNoData = [
];

describe ('ects', function() {
    'use strict';

    beforeEach(function() {
        ects = rewire('../../lib/ects');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #lectureDate', function() {
        expect(ects).to.be.a('function');
    });

    it('should call client', function(done) {
        var searchDetailsSpy = sandbox.spy();
        ects.__set__('client', {searchDetails: searchDetailsSpy});
        expect(searchDetailsSpy.calledWithExactly(
            'Machine-Learning', done()));
    });

    it('should return answer if no lecture was found', function(done) {
        var expected = 'Ich habe keine Vorlesung mit diesem Namen gefunden.';
        testResponse('invalid lecture', expected, ectsNoData, done);
    });
});

function testResponse(lecture, expected, dataMock, done) {
    'use strict';

    sandbox.stub(ects.__get__('client'), 'searchDetails')
        .callsArgWith(2, null, dataMock);

    ects(lecture, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
}
