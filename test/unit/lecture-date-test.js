var rewire = require('rewire');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var lectureDate;

describe ('office', function() {
    'use strict';

    beforeEach(function() {
        lectureDate = rewire('../../lib/lectureDate');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #lectureDate', function() {
        expect(lectureDate).to.be.a('function');
    });

});