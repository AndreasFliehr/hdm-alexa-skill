var expect = require('chai').expect;
var sinon = require('sinon');

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

exports.testThatFunctionCallsSearchDetails = function(fnUnderTest) {
    'use strict';
    var client, fnMatcher, expectation, optionMatcher;
    optionMatcher = sinon.match({ maxResults: process.env.MAX_RESULTS });
    fnMatcher = sinon.match.typeOf('function');
    client = { searchDetails: sinon.spy() };
    fnUnderTest(client, 'ML', function() {});
    expectation = client.searchDetails
        .calledWithExactly('lecture', 'ML', optionMatcher, fnMatcher);
    expect(expectation).to.equal(true);
};

exports.testIfFunctionForwardsSearchDetailsError = function(fnUnderTest, done) {
    'use strict';
    var client, stub;
    stub = sinon.stub().callsArgWith(3, new Error('Test Message'), null);
    client = { searchDetails: stub };
    fnUnderTest(client, 'Machine-Learning', function(err) {
        expect(err.message).to.equal('Test Message');
        done();
    });
};
