var rewire = require('rewire');
var office = rewire('../lib/office');
var expect = require('chai').expect;

describe ('office', function() {
    'use strict';

    it('should be a function #office', function() {
        expect(office).to.be.a('function');
    });
});