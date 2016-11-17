var rewire = require('rewire');
var module = rewire('../');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();

describe('#onIntent', function() {
    it('should expose function #onIntent', function() {
        expect(module.__get__('onIntent')).to.be.a('function');
    });

    it('should call #menu if intent is MenuIntent', function() {
        var spy = sandbox.spy();
        module.__set__('menu', spy);
        module.__get__('onIntent')();
        expect(spy.calledOnce).to.equal(true);
    });
});