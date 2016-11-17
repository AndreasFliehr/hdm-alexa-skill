var rewire = require('rewire');
var menu = rewire('../lib/menu');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();
var data = require('./data/menu');


describe('menu', function() {
    afterEach(function() {
        sandbox.restore();
    });

    it('should be a function #menu', function() {
        expect(menu).to.be.a('function');
    });

    it('should call client', function(done) {
        var mock = sandbox.mock(menu.__get__('client'))
            .expects('menu')
            .once()
            .callsArgWith(0, null, data);
        menu('S-Bar', new Date('2016-11-08'), function() {
            mock.verify();
            done();
        });
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
    sandbox.stub(menu.__get__('client'), 'menu')
        .callsArgWith(0, null, data);

    menu(place, date, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
}