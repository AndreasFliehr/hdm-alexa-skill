'use strict';

var moment = require('moment');

module.exports = function(client, place, date, done) {
    client.menu({}, function(err, data) {
        if (err) {
            return done(err);
        }

        const localMenu = data.find(loc => loc.location.toLowerCase() === place.toLowerCase());

        let response;
        if (!localMenu) {
            response = 'Ich weiß leider nur, was es in der Mensa oder der Essbar gibt.';
        } else {
            response = createResponseFromLocalMenu(localMenu, date);
        }

        done(null, response);
    });
};

function createResponseFromLocalMenu(menu, date) {
    const [mealInfo] = menu.dates.filter(function(meal) {
        const d = new Date(meal.date.substring(0,10));
        return moment(date).isSame(d);
    });

    let response;
    if (!mealInfo || mealInfo.meals.length === 0) {
        response = 'Für diesen Tag hab ich leider keine Informationen.';
    } else {
        const meals = mealInfo.meals.map(item => item.meal);
        response = 'Es gibt ' + meals.join('und ');
    }

    return response;
}
