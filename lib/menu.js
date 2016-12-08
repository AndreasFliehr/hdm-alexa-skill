var Client = require('hdm-client');
var client = new Client();
var moment = require('moment');

module.exports = function(place, date, done) {
    'use strict';

    client.menu(function(err, data) {
        var localMenu, response;

        if (err) {
            done(err);
            return;
        }

        localMenu = data.filter(function(loc) {
            return loc.location === place;
        })[0];

        if (!localMenu) {
            response = 'Ich weiß leider nur, was es in der Mensa oder ' +
                       'der Essbar gibt.';
        } else {
            response = createResponseFromLocalMenu(localMenu, date);
        }

        done(null, response);
    });
};

function createResponseFromLocalMenu(menu, date) {
    'use strict';

    var mealInfo, response, meals;
    mealInfo = menu.dates.filter(function(meal) {
        var d = new Date(meal.date.substring(0,10));
        return moment(date).isSame(d);
    })[0];

    if (!mealInfo || mealInfo.meals.length === 0) {
        response = 'Für diesen Tag hab ich leider keine Informationen.';
    } else {
        meals = mealInfo.meals.map(function(item) {
            return item.meal;
        });
        response = 'Es gibt ' + meals.join('und ');
    }
    return response;
}