var rewire = require('rewire');
var office = rewire('../lib/office');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var data = require('./data/office');
var dataNoRoom = require('./data/officeNoRoom');
var dataMultipleLecturers = require('./data/officeMultipleLecturers');

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

    it('should return answer for lecturer', function(done) {
        var expected = 'Das Büro von Walter Kriha befindet sich in Raum 322.';
        testResponse('person', 'Walter Kriha', expected, data, done);
    });

    it('should return answer for lecturer with no room', function(done) {
        var expected = 'Es existiert kein Büro für Thomas Pohl.';
        testResponse('person', 'Thomas Pohl', expected, dataNoRoom, done);
    });

    it('should return answer for multiple lectures', function(done) {
        var expected = 'Es wurden 2 Personen gefunden:' +
            ' Das Büro von Walter Kriha befindet sich in Raum 322.' +
            ' Es existiert kein Büro für Thomas Pohl.';
        testResponse('person', 'Thomas', expected, dataMultipleLecturers, done);
    });

    it('should provide error if client throws one', function(done) {
        sandbox.stub(office.__get__('client'), 'searchDetails')
            .callsArgWith(0, new Error('Test Message'), null);
        office('person', 'Walter Kriha', function(err) {
            expect(err.message).to.equal('Test Message');
            done();
        });
    });
});

function testResponse(type, name, expected, dataMock, done) {
    'use strict';

    sandbox.stub(office.__get__('client'), 'searchDetails')
        .callsArgWith(0, null, dataMock);

    office(type, name, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
}