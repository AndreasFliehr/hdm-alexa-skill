var expect = require('chai').expect;
var lecture = require('../../lib/lecture');
var Client = require('hdm-client');
var client = new Client();

describe('lecture module', function() {
    'use strict';

    it('.date() should use the client and get a response', function(done) {

        var query = {
            date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
            name: 'Machine-Learning'
        };

        lecture.date(client, query, function(err, res) {
            expect(err).to.not.equal(null);
            done();
        });

    });

    it('.room() should use the client and get a response', function(done) {

        var query = {
            date: 'Mo 08:15-09:45',
            name: 'Agiles Projekt-Management',
            room: '204'
        };

        lecture.room(client, query, function(err, res) {
            expect(err).to.not.equal(null);
            done();
        });

    });

    it('.ects() should use the client and get a response', function(done) {

        var query = {
            date: 'Mi 11:45-13:15 \nMi 14:15-15:45',
            name: 'Machine-Learning',
            ects: 6
        };

        lecture.ects(client, query, function(err, res) {
            expect(err).to.not.equal(null);
            done();
        });

    });
});
