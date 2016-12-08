var expect = require('chai').expect;

exports.createTestCallback = function(error, response, done) {
    'use strict';
    return function(err, res) {
        expect(err).to.equal(error);
        expect(res).to.equal(response);
        done();
    };
};

exports.createIntent = function(name, slots, values) {
    'use strict';
    var intent, i;
    intent = {
        name: name,
        slots: {}
    };
    for (i = 0; i < slots.length; i++) {
        intent.slots[slots[i]] = {name: slots[i]};
        if (values[i]) {
            intent.slots[slots[i]].value = values[i];
        }
    }
    return intent;
};