// Medreville
function render(row) {
    let lines = row.split("\n");
    let res = "";

    for (let i = 1; i < lines.length; i++) {
        let item = lines[i];

        if(item.includes("Brasserie RA")) break;

        if (item.includes("Entrées")) res += "**🥬 Entrée:** \n - ";

        if (item.startsWith("Plats:")) item = "🍽️ " + item;
        if (item.startsWith("Garnitures:")) item = "🥗 " + item;
        if (item.startsWith("Dessert:") || item.startsWith("Desserts:")) item = "🍰 " + item;

        item = item.replace(/^(.*?):/g, "\n **$1**:"); // Bold the first word before ":"
        item = item.replace(/:/g, ":\n -"); // Add a new line after ":"
        item = item.replace(/\//g, "\n -"); // Add a new line after "/"

        res += item + "\n";
    }

    return res;
}

module.exports = { render };