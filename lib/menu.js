var Client = require('hdm-client');
var client = new Client();
var moment = require('moment');

module.exports = function (place, date, done) {
    client.menu(function (err, data) {
        if(err) {
            done(err);
            return;
        }

        var dates = data.filter(function (loc) {
            return loc.location === place;
        })[0].dates;

        var mealInfo = dates.filter(function (meal) {
            var d = new Date(meal.date.substring(0,10));
            return moment(date).isSame(d);
        })[0].meals;

        var meals = mealInfo.reduce(function (prev, curr) {
            return [prev.meal, curr.meal];
        });

        var response = 'Es gibt ' + meals.join('und ');

        done(null, response)
    });

};