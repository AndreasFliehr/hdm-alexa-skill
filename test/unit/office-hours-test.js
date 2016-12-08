var officeHours = require('../../lib/officeHours');
var expect = require('chai').expect;

describe ('officeHours', function() {
    'use strict';

    it('should be a function #officeHours', function() {
        expect(officeHours).to.be.a('function');
    });


});
