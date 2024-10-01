const { getPing } = require("../editor/sendListEditor");
const { getMenu, today } = require("./getMenu");
const { getLocation } = require("../editor/locationEditor");
const fs = require("node:fs");

async function checkMenu(time) {
    let list = getPing(time);
    let menus = [];
    let date = today();

    for (const ping of list) {
        try {
            let menu = await getMenu(ping.id, date);

            if (menu !== null) {
                let location = getLocation(ping.id);
                menus.push({
                    name: location,
                    value: menu
                });
            }
        } catch (error) {
            console.error(`Erreur pour l'ID ${ping.id}: `, error);
        }
    }
    return menus;
}

module.exports = { checkMenu };