const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { filterRestaurants, getRestaurant } = require("../editor/restaurants");
const fs = require('fs');
const { today, renderDate } = require("../menu/getMenu");

async function sendMenu(interaction, menu, id) {
    try {
        const res = getRestaurant(id);

        const desc = res[0].shortDesc;
        const date = renderDate(today());
        const title = res[0].title;
        const img = res[0].thumbnailUrl;

        const lat = res[0].latitude;
        const long = res[0].longitude;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "ULmenu",
                url: "https://github.com/solareflame/ULmenu",
                iconURL: "https://imgur.com/3hsFWw7.png"
            })
            .setColor(0xE30613)
            .setTitle('Menu du ' + date + ' : ' + title)
            .setDescription(desc + '\n' + '[Location](https://www.google.com/maps/search/?api=1&query=' + lat + ',' + long + ')')
            .addFields({
                name: 'Menu :',
                value: menu,
                inline: false
            })
            .setThumbnail('\n' + img)
            .setTimestamp()
            .setFooter({
                text: 'Ulmenu by Solare',
                iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4'
            });

        const button = new ButtonBuilder()
            .setCustomId('info_' + id)
            .setLabel('Plus d\'infos')
            .setStyle(ButtonStyle.Secondary);


        const row = new ActionRowBuilder()
            .addComponents(button);

        if (interaction === null) return embed;


        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: false
        });
    } catch (error) {
        console.error("Error while sending menu: ", error);
    }
}

module.exports = { sendMenu };
