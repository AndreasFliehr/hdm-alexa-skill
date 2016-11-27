var Client = require('hdm-client');
var client = new Client();
var moment = require('moment');

module.exports = function(place, date, done) {
    'use strict';
    client.menu(function(err, data) {
        var dates, mealInfo, meals, response;

        if (err) {
            done(err);
            return;
        }

        dates = data.filter(function(loc) {
            return loc.location === place;
        })[0].dates;

        mealInfo = dates.filter(function(meal) {
            var d = new Date(meal.date.substring(0,10));
            return moment(date).isSame(d);
        })[0];

        if (!mealInfo || mealInfo.meals.length === 0) {
            response = 'Für diesen Tag habe ich leider keine Informationen.';
        } else {
            meals = mealInfo.meals.reduce(function(prev, curr) {
                return [prev.meal, curr.meal];
            });
            response = 'Es gibt ' + meals.join('und ');
        }

        done(null, response);
    });
};