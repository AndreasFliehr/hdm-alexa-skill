var rewire = require('rewire');
var module = rewire('../');
var expect = require('chai').expect;

describe('#onIntent', function() {
    it('should expose function #onIntent', function() {
        expect(module.__get__('onIntent')).to.be.a('function');
    });
});