async function getMenuRow(id, date) {
    date = date || ""; // /!\ appeler avec la date supprime le menu du soir (l'api pue la merde)

    const url = `https://mobile-back.univ-lorraine.fr/restaurant/menus?id=${id}&date=${date}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erreur de l'API : ${response.status} ${response.statusText}`);
        }

        const data = await response.text();
        if (!data) {
            throw new Error("Réponse vide de l'API");
        }

        const parsedData = JSON.parse(data);
        console.log("Réponse de l'API :", parsedData); // Log de la réponse de l'API

        return parsedData;
    } catch (error) {
        console.error("Erreur lors de l'appel API ou du parsing JSON : ", error);
        return null;
    }
}

async function getMenuDate(id, date) {
    let menu_row = await getMenuRow(id, ""); // Appel avec une date vide si null

    if (!menu_row) {
        console.error("Aucun menu trouvé.");
        return null;
    }

    console.log("Menu Row : ", menu_row); // Log des menus renvoyés

    const menuForDate = menu_row.filter(row => row.date === date)[0];

    if (!menuForDate) {
        console.error("Aucun menu pour la date donnée.");
        return null;
    }

    console.log("Menu pour la date : ", menuForDate);

    return menuForDate;
}

async function getMenu(id, date, repas) {
    let menu = await getMenuDate(id, date);

    if (!menu || !menu.meal) {
        console.error("Aucun repas trouvé.");
        return null;
    }

    console.log("Repas trouvés : ", menu.meal); //

    const midiFilteredByRepas = menu.meal.filter(meal => meal.name.toLowerCase() === repas)[0];

    if (!midiFilteredByRepas) {
        console.error(`Aucun repas '${repas}' trouvé.`);
        return null;
    }

    return midiFilteredByRepas;
}

function today() {
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function renderDate(date) {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('fr-FR', options);
}

module.exports = { today, getMenu , renderDate};
