var rewire = require('rewire');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var lectureRoom;

describe('lectureRoom', function() {
    'use strict';

    beforeEach(function() {
        lectureRoom = rewire('../../lib/lectureRoom');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #lectureRoom', function() {
        expect(lectureRoom).to.be.a('function');
    });

    it('should call client', function(done) {
        var searchDetailsSpy = sandbox.spy();
        lectureRoom.__set__('client', {searchDetails: searchDetailsSpy});
        expect(searchDetailsSpy.calledWithExactly('System ' +
            'Engineering', done()));
    });
});