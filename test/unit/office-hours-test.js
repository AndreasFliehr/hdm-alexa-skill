var expect = require('chai').expect;
var office = require('../../lib/lecturer');

describe ('officeHours', function() {
    'use strict';

    it('should be a function #officeHours', function() {
        expect(office.officeHours).to.be.a('function');
    });
});