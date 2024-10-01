const { getMenu, today} = require("./getMenu");
const fs = require("node:fs");

function renderMenu(menu) {
    let res = "";

    let foodcats = [];

    for (let i = 0; i < menu.foodcategory.length; i++) {
        res += `**${menu.foodcategory[i].name}**\n`;

        for (let j = 0; j < menu.foodcategory[i].dishes.length; j++) {
            res += `- ${menu.foodcategory[i].dishes[j]}\n`;
        }

        res += "\n";
    }

    return res;
}

module.exports = { renderMenu };

async function directMenu(id, date, repas) {
    let menu = await getMenu(id, date, repas);

    if (!menu) {
        console.error("Erreur lors de la récupération du menu.");
        return null;
    }

    return renderMenu(menu);
}

module.exports = { directMenu };





