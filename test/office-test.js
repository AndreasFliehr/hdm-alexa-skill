var rewire = require('rewire');
var office = rewire('../lib/office');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var data = require('./data/office');

describe ('office', function() {
    'use strict';

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #office', function() {
        expect(office).to.be.a('function');
    });

    it('should call client', function(done) {
        var searchDetailsSpy = sandbox.spy(office.__get__('client'),
            'searchDetails');
        office('person','Walter Kriha', done());
        expect(searchDetailsSpy.called);
    });

    it('should return answer for lecturer Walter Kriha', function(done) {
        var expected = 'Das Büro von Walter Kriha befindet sich in Raum 322';
        testResponse('person', 'Walter Kriha', expected, done);
    });
});

function testResponse(type, name, expected, done) {
    'use strict';

    sandbox.stub(office.__get__('client'), 'searchDetails')
        .callsArgWith(0, null, data);

    office(type, name, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
}