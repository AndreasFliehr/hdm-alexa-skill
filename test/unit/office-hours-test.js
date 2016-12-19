var expect = require('chai').expect;
var lecturer = require('../../lib/lecturer');

describe ('officeHours', function() {
    'use strict';

    it('should be a function #officeHours', function() {
        expect(lecturer.officeHours).to.be.a('function');
    });
});