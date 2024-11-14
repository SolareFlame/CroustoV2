const fs = require('fs');
const { rcwd } = require('../util/path');

const Storages = {
    Restaurants: rcwd('storage', 'restaurants.json'),
    SendList: rcwd('storage', 'sendList.json')
}

/**
 * Wrapper around JSON storage files.
 */
class JsonStorageManager {


    /**
     * Gets the JSON configuration file for the given storage, creating it if it doesn't exist.
     */
    static getStorage(storage, orDefault = {}) {

        if (!fs.existsSync(storage)) {
            fs.writeFileSync(storage, JSON.stringify(orDefault, null, 4));
        }

        return JSON.parse(fs.readFileSync(storage));
    }


}

module.exports = { JsonStorageManager, Storages };