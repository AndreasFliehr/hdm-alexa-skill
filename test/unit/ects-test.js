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

    it('should call client', function(done) {
        var searchDetailsSpy = sandbox.spy();
        ects.__set__('client', {searchDetails: searchDetailsSpy});
        expect(searchDetailsSpy.calledWithExactly(
            'Machine-Learning', done()));
    });
});
