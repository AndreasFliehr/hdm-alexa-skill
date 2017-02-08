var rewire = require('rewire');
var lecturer = rewire('../../lib/lecturer');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('officeHours', function() {
    'use strict';

    before(function() {
        process.env.MAX_RESULTS = 797;
    });

    it('should be a function #officeHours', function() {
        expect(lecturer.officeHours).to.be.a('function');
    });

    it('should call client', function() {
        var client, fnMatcher, expectation, optionMatcher;
        optionMatcher = sinon.match({ maxResults: process.env.MAX_RESULTS });
        fnMatcher = sinon.match.typeOf('function');
        client = { searchDetails: sinon.spy() };
        expectation = client.searchDetails
            .calledWithExactly('person', 'Walter', optionMatcher, fnMatcher);
        lecturer.office(client, 'Walter', function() {
            expect(expectation).to.equal(true);
        });
    });

    it('should throw an error if the client throws one', function(done) {
        var client, stub;
        stub = sinon.stub().callsArgWith(3, new Error('Test Message'), null);
        client = { searchDetails: stub };

        lecturer.officeHours(client, 'Sabine Ghellal', function(err, response) {
                expect(err.message).to.equal('Test Message');
                expect(response).to.equal(undefined);
                done();
            });
    });

    it('should get a response', function(done) {
        var data = [{
            name: 'Sabiha Ghellal',
            officehours: 'Do 14:-16:'
        }];

        var client, stub;
        stub = sinon.stub().callsArgWith(3, null, data);
        client = { searchDetails: stub };

        lecturer.officeHours(client, 'Sabine Ghellal', function(err, response) {
                expect(err).to.equal(null);
                expect(response).to.not.equal(null);
                done();
            });
    });

    it('should tell you if there were no matches', function(done) {
        var client, stub, data, responseText;

        data = [];
        stub = sinon.stub().callsArgWith(3, null, data);
        client = { searchDetails: stub };
        responseText = 'Es wurden keine Treffer zu diesem Namen gefunden';

        lecturer.officeHours(client, 'Sabine Ghellal', function(err, response) {
                expect(err).to.equal(null);
                expect(response).to.equal(responseText);
                done();
            });
    });

    it('should return the office time if theres just one res', function(done) {
        var client, stub, data, responseText;

        data = [{
            name: 'Sabiha Ghellal',
            officehours: 'Do 14:-16:'
        }];

        stub = sinon.stub().callsArgWith(3, null, data);
        client = { searchDetails: stub };
        responseText = 'Sabiha Ghellal hat am Do 14:00-16:00 Sprechstunde.';

        lecturer.officeHours(client, 'Sabine Ghellal', function(err, response) {
                expect(err).to.equal(null);
                expect(response).to.equal(responseText);
                done();
            });
    });

    it('should return a response time if theres just ' +
    'one res but no office hours', function(done) {
        var client, stub, data, responseText;

        data = [{
            name: 'Sabiha Ghellal',
            officehours: null
        }];

        stub = sinon.stub().callsArgWith(3, null, data);
        client = { searchDetails: stub };
        responseText =
        'Für Sabiha Ghellal sind keine Sprechzeiten eingetragen.';

        lecturer.officeHours(client, 'Sabine Ghellal', function(err, response) {
                expect(err).to.equal(null);
                expect(response).to.equal(responseText);
                done();
            });
    });

    it('should tell you that there were more than one matches' +
    'and their respective office hours', function(done) {
        var client, stub, data, responseText;

        data = [{
            name: 'Stefan Kökert',
            officehours: null
        },
        {
            name: 'Stefan Rathgeb',
            officehours: null
        },
        {
            name: 'Dr. Silvia Stefanova',
            officehours: null
        },
        {
            name: 'Stefan Kountouris',
            officehours: 'Do 16:00-17:30'
        },
        {
            name: 'Dr. Stefan Wiedmann',
            officehours: null
        },
        {
            name: 'Stefan Scheurer',
            officehours: 'Do 14:-16:'
        }];

        stub = sinon.stub().callsArgWith(3, null, data);
        client = { searchDetails: stub };
        responseText = 'Es wurden mehrere Treffer zu diesem Namen gefunden: ' +
        'Stefan Kountouris: Do 16:00-17:30, ' +
        'Stefan Scheurer: Do 14:00-16:00. ' +
        'Für folgende Personen sind keine Zeiten eingetragen: ' +
        'Stefan Kökert, ' +
        'Stefan Rathgeb, ' +
        'Dr. Silvia Stefanova, ' +
        'Dr. Stefan Wiedmann';

        lecturer.officeHours(client, 'Stefan', function(err, response) {
                expect(err).to.equal(null);
                expect(response).to.equal(responseText);
                done();
            });
    });
});
