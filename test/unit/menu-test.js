var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('../utils');
var data = require('./data/menu');

var menu = require('../../lib/menu');

describe('menu', function() {
    'use strict';

    it('should be a function #menu', function() {
        expect(menu).to.be.a('function');
    });

    it('should call client', function() {
        var fnMatcher, expectation, client;
        fnMatcher = sinon.match.typeOf('function');
        client = { menu: sinon.spy() };
        menu(client, 'S-Bar', new Date('2016-11-08'), function() {});
        expectation = client.menu.calledWithExactly(fnMatcher);
        expect(expectation).to.equal(true);
    });

    it('should return answer for menu at 2016-11-08', function(done) {
        var expected = 'Es gibt Nudeln mit Putenfleisch in Paprikasoße und ' +
            'Nudeln mit Grünkern-Bolognese ';
        testMenuResponse('S-Bar', new Date('2016-11-08'), expected,
            data, done);
    });

    it('should return answer for menu at 2016-11-09', function(done) {
        var expected = 'Es gibt Schweinehaxe mit herbstlichem Gemüse, dazu ' +
            'Salzkartoffeln und Bratensoße und Gemüsefrikadelle mit ' +
            'herbstlichem Gemüse, dazu Salzkartoffeln und helle Soße ';
        testMenuResponse('S-Bar', new Date('2016-11-09'), expected, data, done);
    });

    it('should return answer for day without menu', function(done) {
        var expected = 'Für diesen Tag hab ich leider keine Informationen.';
        testMenuResponse('S-Bar', new Date('2015-11-09'), expected, data, done);
    });

    it('should return answer for menu without meals', function(done) {
        var expected = 'Für diesen Tag hab ich leider keine Informationen.';
        testMenuResponse('Mensa', new Date('2016-11-09'), expected, data, done);
    });

    it('should return answer for lower case location', function(done) {
        var expected = 'Für diesen Tag hab ich leider keine Informationen.';
        testMenuResponse('mensa', new Date('2016-11-09'), expected, data, done);
    });

    it('should return answer for invalid locations', function(done) {
        var expected = 'Ich weiß leider nur, was es in der Mensa oder der ' +
            'Essbar gibt.';
        testMenuResponse(
            'McDonalds', new Date('2016-11-09'), expected, data, done);
    });

    it('should provide error if client throws one', function(done) {
        var client, stub;
        stub = sinon.stub().callsArgWith(0, new Error('Test Message'), null);
        client = { menu: stub };
        menu(client, 'S-Bar', new Date('2016-11-08'), function(err) {
            expect(err.message).to.equal('Test Message');
            done();
        });
    });
});

function testMenuResponse(place, date, expected, menuData, done) {
    'use strict';

    var client = {menu: sinon.stub().callsArgWith(0, null, menuData)};
    menu(client, place, date, utils.createTestCallback(null, expected, done));
}

