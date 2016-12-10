var rewire = require('rewire');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var ects;

describe ('ects', function() {
    'use strict';

    beforeEach(function() {
        ects = rewire('../../lib/ects');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #lectureDate', function() {
        expect(ects).to.be.a('function');
    });

});
