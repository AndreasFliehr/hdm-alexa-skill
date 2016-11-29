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
        expect(searchDetailsSpy.calledWithExactly('Walter Kriha', done()));
    });

    it('should return answer for lecturer', function(done) {
        var expected = 'Das Büro von Walter Kriha befindet sich in Raum 322.';
        testResponse('Walter Kriha', expected, data, done);
    });

    it('should return answer for lecturer with no room', function(done) {
        var expected = 'Es existiert kein Büro für Thomas Pohl.';
        testResponse('Thomas Pohl', expected, dataNoRoom, done);
    });

    it('should return answer for multiple lectures', function(done) {
        var expected = 'Es wurden 2 Personen gefunden:' +
            ' Das Büro von Walter Kriha befindet sich in Raum 322.' +
            ' Es existiert kein Büro für Thomas Pohl.';
        testResponse('Thomas', expected, dataMultipleLecturers, done);
    });

    it('should provide error if client throws one', function(done) {
        sandbox.stub(office.__get__('client'), 'searchDetails')
            .callsArgWith(2, new Error('Test Message'), null);
        office('Walter Kriha', function(err) {
            expect(err.message).to.equal('Test Message');
            done();
        });
    });
});

function testResponse(lecturer, expected, dataMock, done) {
    'use strict';

    sandbox.stub(office.__get__('client'), 'searchDetails')
        .callsArgWith(2, null, dataMock);

    office(lecturer, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
}