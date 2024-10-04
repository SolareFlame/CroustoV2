const { checkMenu } = require('./menu/checkMenu');
const { renderMenu } = require('./menu/renderMenu');
const { sendMenu } = require('./command/commandSendMenu');
require('dotenv').config();

function startChecking(client) {
    const now = new Date();
    const nextHour = new Date(now);

    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    let timeUntilNextHour = nextHour - now;

    console.log(`Prochaine exécution à : ${nextHour.toLocaleTimeString()}, dans ${timeUntilNextHour / 1000} secondes`);

    timeUntilNextHour = 1; //DEBUG

    setTimeout(async () => {
        await checkMenus(client);
        setInterval(async () => await checkMenus(client), 3600000); // Corrected to pass a function
    }, timeUntilNextHour);
}

async function checkMenus(client) {
    let h = new Date().getHours();
    console.log(`Heure data : ${h}`);

    let menus = await checkMenu(h);
    console.log("Menus récupérés :", menus);

    for (let menu of menus) {
        let channelID = menu.channelID;
        let roleID = menu.roleID;

        console.log(`Envoi du menu ${menu.id} dans le channel ${channelID} pour le rôle ${roleID}`);

        try {
            let channel = await client.channels.fetch(channelID);

            if (channel) {
                let roleMention = `<@&${roleID}>`;
                let embed = await sendMenu(null, menu.menu, parseInt(menu.id));

                channel.send({
                    content: `${roleMention}`,
                    embeds: [embed]
                });
            } else {
                console.error(`Channel with ID ${channelID} not found.`);
            }
        } catch (error) {
            console.error(`Error fetching channel: ${error.message}`);
        }
    }
}


module.exports = { startChecking, checkMenus };
