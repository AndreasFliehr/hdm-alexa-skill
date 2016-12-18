var expect = require('chai').expect;

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