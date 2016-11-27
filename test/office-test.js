var rewire = require('rewire');
var office = rewire('../lib/office');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();

describe ('office', function() {
    'use strict';

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #office', function() {
        expect(office).to.be.a('function');
    });

    it('should call client', function(done) {
        var searchDetailsSpy = sandbox.spy(office.__get__('client'),
            'searchDetails');
        office('person','Walter Kriha', done());
        expect(searchDetailsSpy.called);
    });
});