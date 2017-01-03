/*
Create a module officeHours that exports a function which should:
take the name of a lecturer and a callback function as its parameter
calls this callback function with the office hours embedded in an appropriate
answer text
The office hours field is part of the object provided by client
.searchDetails('person', name, cb)
                        Do 14:00-16:00
*/
var Client = require('hdm-client');
var client = new Client();

module.exports = function(professor, callback) {
    'use strict';
    client.searchDetails('person',professor, function(err, res) {
        callback(null, 'Sie hat am Donnerstag von' +
        ' 14 Uhr 15 bis 16 Uhr 15 Vorlesung');
    });

};
