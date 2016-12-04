var lectureRoom = require('../../lib/lectureRoom');
var expect = require('chai').expect;

describe('lectureRoom', function() {
    'use strict';

    it('should be a function #lectureRoom', function() {
        expect(lectureRoom).to.be.a('function');
    });
});