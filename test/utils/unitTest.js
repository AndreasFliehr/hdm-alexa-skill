var expect = require('chai').expect;
var sinon = require('sinon');

exports.testLectureResponse = function
    (query, expected, dataMock, sandbox, lecture, lectureFn, done) {
    'use strict';

    sandbox.stub(lecture.__get__('client'), 'searchDetails')
        .callsArgWith(2, null, dataMock);

    lectureFn(query, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
};

exports.shouldCallLectureClient = function(sandbox, lecture) {
    'use strict';
    var searchDetailsSpy, fnMatcher, expectation;
    searchDetailsSpy = sandbox.spy();
    fnMatcher = sinon.match.typeOf('function');
    lecture.__set__('client', {searchDetails: searchDetailsSpy});
    lecture.ects('Machine-Learning', function() {});
    expectation = searchDetailsSpy
        .calledWithExactly('lecture', 'Machine-Learning', fnMatcher);
    expect(expectation).to.equal(true);
};

exports.shouldCallOfficeClient = function(sandbox, office) {
    'use strict';
    var searchDetailsSpy, fnMatcher, expectation;
    searchDetailsSpy = sandbox.spy();
    fnMatcher = sinon.match.typeOf('function');
    office.__set__('client', {searchDetails: searchDetailsSpy});
    office('Walter Kriha', function() {});
    expectation = searchDetailsSpy
        .calledWithExactly('person', 'Walter Kriha', fnMatcher);
    expect(expectation).to.equal(true);
};

exports.testMenuResponse = function
    (place, date, expected, dataMock, sandbox, menu, done) {
    'use strict';

    sandbox.stub(menu.__get__('client'), 'menu')
        .callsArgWith(0, null, dataMock);

    menu(place, date, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
};

exports.testOfficeResponse = function
    (lecturer, expected, dataMock, sandbox, office, done) {
    'use strict';

    sandbox.stub(office.__get__('client'), 'searchDetails')
        .callsArgWith(2, null, dataMock);

    office(lecturer, function(err, response) {
        expect(response).to.equal(expected);
        done();
    });
};