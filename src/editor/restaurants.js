// API : https://mobile-back.univ-lorraine.fr/restaurants

const fs = require("node:fs");
const { JsonStorageManager, Storages } = require("../managers/StorageManager");
const { rcwd } = require("../util/path");

function updateRestaurants() {
    const url = 'https://mobile-back.univ-lorraine.fr/restaurants';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Writing restaurants to file...");
            fs.writeFileSync(Storages.Restaurants, JSON.stringify(data, null, 4));
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
    let list = JsonStorageManager.getStorage(Storages.Restaurants, []);

    list = list.filter(restaurant =>
        !restaurant.title.includes("Cafet") &&
        !restaurant.title.includes("Truck") &&
        !restaurant.title.includes("Market") &&
        !restaurant.title.includes("Facteria")
    );

    if(list.length > 25) {
        console.log("WARNING: More than 25 restaurants found. Limiting to 25.");
        list = list.slice(0, 25);
    }

    console.log("Filtered restaurants: ", list);

    return list;
}



module.exports = { updateRestaurants, getRestaurant, existsRestaurant, filterRestaurants };
