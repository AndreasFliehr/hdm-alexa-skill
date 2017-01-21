var expect = require('chai').expect;
var sinon = require('sinon');
var data = require('./data/office');
var dataNoRoom = require('./data/officeNoRoom');
var dataMultipleLecturers = require('./data/officeMultipleLecturers');
var lecturer = require('../../lib/lecturer');

describe ('office', function() {
    'use strict';

    it('should be a function #office', function() {
        expect(lecturer.office).to.be.a('function');
    });

    it('should call client', function() {
        var client, fnMatcher, expectation;
        fnMatcher = sinon.match.typeOf('function');
        client = { searchDetails: sinon.spy() };
        lecturer.office(client, 'Walter Kriha', function() {});
        expectation = client.searchDetails
            .calledWithExactly('person', 'Walter Kriha', {}, fnMatcher);
        expect(expectation).to.equal(true);
    });

    it('should return answer for lecturer', function(done) {
        var expected = 'Das Büro von Walter Kriha ist in Raum 322';
        testOfficeResponse('Walter Kriha', expected, data, done);
    });

    it('should return answer for lecturer with no room', function(done) {
        var expected = 'Thomas Pohl hat kein Büro';
        testOfficeResponse('Thomas Pohl', expected, dataNoRoom, done);
    });

    it('should return answer for multiple lectures', function(done) {
        var expected = 'Ich habe 2 Personen gefunden:' +
            ' Das Büro von Walter Kriha ist in Raum 322,' +
            ' Thomas Pohl hat kein Büro';
        testOfficeResponse('Thomas', expected, dataMultipleLecturers, done);
    });

    it('should return answer if there were no matches', function(done) {
        var expected = 'Es wurden keine Treffer zu diesem Namen gefunden';
        data = [];
        testOfficeResponse('Thomas', expected, data, done);
    });

    it('should provide error if client throws one', function(done) {
        var client, stub;
        stub = sinon.stub().callsArgWith(3, new Error('Test Message'), null);
        client = { searchDetails: stub };

        lecturer.office(client, 'Walter Kriha', function(err) {
            expect(err.message).to.equal('Test Message');
            done();
        });
    });
});

function testOfficeResponse(name, expected, lecturerData, done) {
    'use strict';

    var client, stub;
    stub = sinon.stub().callsArgWith(3, null, lecturerData);
    client = { searchDetails: stub };

    lecturer.office(client, name, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
}