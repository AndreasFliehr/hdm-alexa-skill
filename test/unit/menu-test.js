var rewire = require('rewire');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var data = require('./data/menu');
var menu;


describe('menu', function() {
    'use strict';

    beforeEach(function() {
        menu = rewire('../../lib/menu');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #menu', function() {
        expect(menu).to.be.a('function');
    });

    it('should call client', function() {
        var menuSpy = sandbox.spy();
        menu.__set__('client', {menu: menuSpy});
        menu('S-Bar', new Date('2016-11-08'), function() {});
        expect(menuSpy.calledOnce).to.equal(true);
    });

    it('should return answer for menu at 2016-11-08', function(done) {
        var expected = 'Es gibt Nudeln mit Putenfleisch in Paprikasoße und ' +
            'Nudeln mit Grünkern-Bolognese ';
        testResponse('S-Bar', new Date('2016-11-08'), expected, done);
    });

    it('should return answer for menu at 2016-11-09', function(done) {
        var expected = 'Es gibt Schweinehaxe mit herbstlichem Gemüse, dazu ' +
            'Salzkartoffeln und Bratensoße und Gemüsefrikadelle mit ' +
            'herbstlichem Gemüse, dazu Salzkartoffeln und helle Soße ';
        testResponse('S-Bar', new Date('2016-11-09'), expected, done);
    });

    it('should return answer for day without menu', function(done) {
        var expected = 'Für diesen Tag hab ich leider keine Informationen.';
        testResponse('S-Bar', new Date('2015-11-09'), expected, done);
    });

    it('should return answer for menu without meals', function(done) {
        var expected = 'Für diesen Tag hab ich leider keine Informationen.';
        testResponse('Mensa', new Date('2016-11-09'), expected, done);
    });

    it('should return answer for lower case location', function(done) {
        var expected = 'Für diesen Tag hab ich leider keine Informationen.';
        testResponse('mensa', new Date('2016-11-09'), expected, done);
    });

    it('should return answer for invalid locations', function(done) {
        var expected = 'Ich weiß leider nur, was es in der Mensa oder der ' +
            'Essbar gibt.';
        testResponse('McDonalds', new Date('2016-11-09'), expected, done);
    });

    it('should provide error if client throws one', function(done) {
        sandbox.stub(menu.__get__('client'), 'menu')
            .callsArgWith(0, new Error('Test Message'), null);
        menu('S-Bar', new Date('2016-11-08'), function(err) {
            expect(err.message).to.equal('Test Message');
            done();
        });
    });
});

function testResponse(place, date, expected, done) {
    'use strict';

    sandbox.stub(menu.__get__('client'), 'menu')
        .callsArgWith(0, null, data);

    menu(place, date, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
}