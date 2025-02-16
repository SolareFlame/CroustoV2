const { getPing } = require("../editor/sendListEditor");
const { getMenu, today } = require("./getMenu");
const { getRestaurant } = require("../editor/restaurants");
const fs = require("node:fs");
const {directMenu} = require("./renderMenu");

async function checkMenu(time) {
    let list = getPing(time);
    console.log(`Liste des pings pour l'heure ${time} : ${list}`);

    let repas = time < 15 ? "midi" : "soir";

    let menus = [];
    let date = today();

    for (const ping of list) {
        try {
            let menu = await directMenu(ping.id, date, repas);

            if (menu !== null) {
                menus.push(
                    {
                        id: ping.id,
                        channelID: ping.channelID,
                        roleID: ping.roleID,
                        menu: menu
                    }
                );
            }
        } catch (error) {
            console.error(`Erreur pour l'ID ${ping.id}: `, error);
        }
    }
    return menus;
}

module.exports = { checkMenu };