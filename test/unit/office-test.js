var rewire = require('rewire');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var data = require('./data/office');
var utils = require('../utils/unitTest');
var dataNoRoom = require('./data/officeNoRoom');
var dataMultipleLecturers = require('./data/officeMultipleLecturers');

var office;

describe ('office', function() {
    'use strict';

    beforeEach(function() {
        office = rewire('../../lib/office');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #office', function() {
        expect(office).to.be.a('function');
    });

    it('should call client', function() {
        utils.shouldCallOfficeClient(sandbox, office);
    });

    it('should return answer for lecturer', function(done) {
        var expected = 'Das Büro von Walter Kriha ist in Raum 322';
        utils.testOfficeResponse('Walter Kriha', expected, data,
            sandbox, office, done);
    });

    it('should return answer for lecturer with no room', function(done) {
        var expected = 'Thomas Pohl hat kein Büro';
        utils.testOfficeResponse('Thomas Pohl', expected, dataNoRoom,
            sandbox, office, done);
    });

    it('should return answer for multiple lectures', function(done) {
        var expected = 'Ich habe 2 Personen gefunden:' +
            ' Das Büro von Walter Kriha ist in Raum 322,' +
            ' Thomas Pohl hat kein Büro';
        utils.testOfficeResponse('Thomas', expected, dataMultipleLecturers,
            sandbox, office, done);
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