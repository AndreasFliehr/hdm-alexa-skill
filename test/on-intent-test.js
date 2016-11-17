var rewire = require('rewire');
var module = rewire('../');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var moduleBackup = module;

describe('#onIntent', function() {
    beforeEach(function() {
        sandbox.restore();
        module = moduleBackup;
    });
    it('should expose function #onIntent', function() {
        expect(module.__get__('onIntent')).to.be.a('function');
    });

    it('should call #menu if intent is MenuIntent', function() {
        testIfMenuIsCalled('MenuIntent', true);
    });

    it('should not call #menu if intent is not MenuIntent', function() {
        testIfMenuIsCalled('OtherIntent', false);
    });
});

function testIfMenuIsCalled(type, expected) {
    var spy = sandbox.spy();
    module.__set__('menu', spy);
    module.__get__('onIntent')({type: type});
    expect(spy.calledOnce).to.equal(expected);
}