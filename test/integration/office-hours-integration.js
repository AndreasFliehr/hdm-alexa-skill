var rewire = require('rewire');
var officeHours = rewire('../../lib/officeHours');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();

describe('officeHours', function() {
    'use strict';

    it('should be a function #officeHours', function() {
        expect(officeHours).to.be.a('function');
    });

    it('should get a response', function(done) {

        officeHours('Sabine Ghellal', function(err, response) {
                expect(err).to.equal(null);
                done();
            });
    });
});
