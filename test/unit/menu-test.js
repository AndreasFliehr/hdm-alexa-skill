var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('../utils/unitTest');
var sandbox = sinon.sandbox.create();
var data = require('./data/menu');

var menu = require('../../lib/menu');

describe('menu', function() {
    'use strict';

    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #menu', function() {
        expect(menu).to.be.a('function');
    });

    it('should call client', function() {
        utils.shouldCallMenuClient(sandbox, menu);
    });

    it('should return answer for menu at 2016-11-08', function(done) {
        var expected = 'Es gibt Nudeln mit Putenfleisch in Paprikasoße und ' +
            'Nudeln mit Grünkern-Bolognese ';
        utils.testMenuResponse('S-Bar', new Date('2016-11-08'), expected,
            data, sandbox, menu, done);
    });

    it('should return answer for menu at 2016-11-09', function(done) {
        var expected = 'Es gibt Schweinehaxe mit herbstlichem Gemüse, dazu ' +
            'Salzkartoffeln und Bratensoße und Gemüsefrikadelle mit ' +
            'herbstlichem Gemüse, dazu Salzkartoffeln und helle Soße ';
        utils.testMenuResponse('S-Bar', new Date('2016-11-09'), expected,
            data, sandbox, menu, done);
    });

    it('should return answer for day without menu', function(done) {
        var expected = 'Für diesen Tag hab ich leider keine Informationen.';
        utils.testMenuResponse('S-Bar', new Date('2015-11-09'), expected,
            data, sandbox, menu, done);
    });

    it('should return answer for menu without meals', function(done) {
        var expected = 'Für diesen Tag hab ich leider keine Informationen.';
        utils.testMenuResponse('Mensa', new Date('2016-11-09'), expected,
            data, sandbox, menu, done);
    });

    it('should return answer for lower case location', function(done) {
        var expected = 'Für diesen Tag hab ich leider keine Informationen.';
        utils.testMenuResponse('mensa', new Date('2016-11-09'), expected,
            data, sandbox, menu, done);
    });

    it('should return answer for invalid locations', function(done) {
        var expected = 'Ich weiß leider nur, was es in der Mensa oder der ' +
            'Essbar gibt.';
        utils.testMenuResponse('McDonalds', new Date('2016-11-09'), expected,
            data, sandbox, menu, done);
    });

    it('should provide error if client throws one', function(done) {
        utils.shouldProvideMenuError(sandbox, menu, done);
    });
});