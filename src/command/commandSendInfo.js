const { EmbedBuilder } = require('discord.js');
const {filterRestaurants, getRestaurant} = require("../editor/restaurants");
const fs = require('fs');
const {today, renderDate} = require("../menu/getMenu");

async function sendInfo(interaction, id) {
    try {
        const res = getRestaurant(id);

        const desc = res[0].shortDesc;
        const title = res[0].title;
        const img = res[0].thumbnailUrl;

        const lat = res[0].latitude;
        const long = res[0].longitude;

        const zone = res[0].zone;

        const contactHTML = res[0].contact;
        const $ = require('cheerio').load(contactHTML);

        const name = $('h2').text();
        const address = $('p').text().split('Tél')[0].trim();

        const phoneMatch = $('p').text().match(/Tél.*?:\s*(.*)/);
        const phone = phoneMatch ? phoneMatch[1].trim() : 'Non trouvé';

        const edt = res[0].opening;


        const embed = new EmbedBuilder()
            .setAuthor({
                name: process.env.DISCORD_BOT_NAME,
                url: process.env.GITHUB_URL,
                iconURL: process.env.LOGO_1_URL
            })
            .setColor(0xE30613)
            .setTitle('Information sur ' + title)
            .setDescription(desc)
            .addFields({
                name: 'Localisation',
                value: `[${address}](https://www.google.com/maps/search/?api=1&query=${lat},${long})`,
                inline: true
            }, {
                name: 'Contact',
                value: `${name}\n${phone}`,
                inline: true
            }, {
                name: 'EDT',
                value: "```" +
                    `Lundi:    ${edt[1].label}\n` +
                    `Mardi:    ${edt[2].label}\n` +
                    `Mercredi: ${edt[3].label}\n` +
                    `Jeudi:    ${edt[4].label}\n` +
                    `Vendredi: ${edt[5].label}\n` +
                    `Samedi:   ${edt[6].label}\n` +
                    `Dimanche: ${edt[7].label}` +
                    "```",
                inline: false
            })

            .setThumbnail('\n' + img)
            .setTimestamp()
            .setFooter({
                text: `${process.env.DISCORD_BOT_NAME} by Solare`,
                iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4'
            });

        // Send the embed to the channel
        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    } catch (error) {
        console.error("Error while sending menu: ", error);
    }
}

module.exports = { sendInfo };
