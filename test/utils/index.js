/**
 * Created by Jonas on 20.11.2016.
 *
 */
var expect = require('chai').expect;

exports.createTestCallback = function(error, response, done) {
    'use strict';
    return function(err, res) {
        expect(err).to.equal(error);
        expect(res).to.equal(response);
        done();
    };
};

exports.createMenuIntent = function(slots, values) {
    'use strict';
    var intent, i;
    intent = {
        name: 'MenuIntent',
        slots: {}
    };
    for (i = 0; i < slots.length; i++) {
        intent.slots[slots[i]] = {
            name: slots[i],
            value: values[i]
        };
    }
    return intent;
};