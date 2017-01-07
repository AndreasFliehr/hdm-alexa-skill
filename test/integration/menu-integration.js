var expect = require('chai').expect;
var menu = require('../../lib/menu');
var Client = require('hdm-client');
var client = new Client();

describe('menu integration test', function() {
    'use strict';

    it('should use the client and get a response', function(done) {

        menu(client, 'Essbar', new Date('2016-11-09'), function(err, res) {
            expect(err).to.not.equal(null);
            done();
        });

    });
});
