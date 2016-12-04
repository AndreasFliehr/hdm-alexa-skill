var rewire = require('rewire');
var lectureRoom = rewire('../../lib/lectureRoom');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var data = require('./data/lectureRoom');

describe('lectureRoom', function() {
    'use strict';

    afterEach(function () {
        sandbox.restore();
    });

    it('should be a function #lectureRoom', function () {
        expect(lectureRoom).to.be.a('function');
    });
});