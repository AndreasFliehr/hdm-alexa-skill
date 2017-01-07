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
        var data = {
            name: 'Sabine Ghellal',
            officehours: 'Do 14:15-16:15'
        };

        sandbox.stub(officeHours.__get__('client'), 'searchDetails')
         .callsArgWith(3, null, data);

        officeHours('Sabine Ghellal', function(err, response) {
                expect(err).to.equal(null);
                expect(response).to.equal('123');
                done();
            });
    });
});
