const { getMenu, today} = require("./getMenu");
const fs = require("node:fs");

function renderMenu(menu, id) {
    let res = "";

    for (let i = 0; i < menu.foodcategory.length; i++) {
        res += `**${menu.foodcategory[i].name}**\n`;

        for (let j = 0; j < menu.foodcategory[i].dishes.length; j++) {
            if (menu.foodcategory[i].dishes[j] === "") {
                   continue;
                } else {
                res += menu.foodcategory[i].dishes[j] + "\n";
            }
        }
        res += "\n";
    }

    if (fs.existsSync("./configs/" + id + ".js")) {
        console.log("Fichier de personnalisation personnalisé trouvé.")

        const { render } = require('../configs/' + id + '.js');
        res = render(res);
    } else {
        console.log("Fichier de personnalisation innexistant.")
    }

    return res;
}

async function directMenu(id, date, repas) {
    let menu = await getMenu(id, date, repas);

    if (!menu) {
        console.error("Erreur lors de la récupération du menu.");
        return null;
    }

    return renderMenu(menu, id);
}

module.exports = { directMenu };





