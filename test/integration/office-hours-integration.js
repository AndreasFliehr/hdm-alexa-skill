var rewire = require('rewire');
var lecturer = rewire('../../lib/lecturer');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();

var Client = require('hdm-client');
var client = new Client();

describe('officeHours integration test', function() {
    'use strict';

    it('should be a function #officeHours', function() {
        expect(lecturer.officeHours).to.be.a('function');
    });

    it('should get a response', function(done) {

        lecturer.officeHours(client, 'Sabine Ghellal', function(err, response) {
                expect(err).to.equal(null);
                expect(response).to.not.equal(null);
                done();
            });
    });
});
