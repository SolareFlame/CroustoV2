// API : https://mobile-back.univ-lorraine.fr/restaurants

const path = "../../restaurants.json"

const fs = require("node:fs");
const restaurants= require(path);

function updateRestaurants() {
    const url = 'https://mobile-back.univ-lorraine.fr/restaurants';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Writing restaurants to file...");
            fs.writeFileSync(path, JSON.stringify(data, null, 4));
        })
        .catch(error => {
            console.error("Error while fetching restaurants: ", error);
        });
}

function getRestaurant(id) {
    return filterRestaurants().filter(restaurant => restaurant.id === id);
}

function existsRestaurant(id) {
    return getRestaurant(id) !== undefined;
}

function filterRestaurants() {
    return restaurants.filter(restaurant =>
        !restaurant.title.includes("Cafet") &&
        !restaurant.title.includes("Truck") &&
        !restaurant.title.includes("Market") &&
        !restaurant.title.includes("Facteria"));
}


module.exports = { updateRestaurants, getRestaurant, existsRestaurant, filterRestaurants };
