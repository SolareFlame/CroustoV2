const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { filterRestaurants, getRestaurant } = require("../editor/restaurants");
const fs = require('fs');
const { today, renderDate } = require("../menu/getMenu");
const { listPings } = require("../editor/sendListEditor");
require ('dotenv').config();

async function sendList(interaction, client, serverID) {
    try {
        const pinglist = listPings(serverID, client);

        const embed = new EmbedBuilder()
            .setAuthor({
                name: process.env.DISCORD_BOT_NAME,
                url: process.env.GITHUB_URL,
                iconURL: process.env.LOGO_1_URL
            })
            .setColor(0xE30613)
            .setTitle('Liste des pings')

            .setDescription(pinglist.map(ping => `<#${ping.channelID}> : ${getRestaurant(parseInt(ping.id))[0].title} - <@&${ping.roleID}> - ${ping.time}:00h`).join('\n'))
            .setThumbnail(process.env.LOGO_1_URL)
            .setTimestamp()
            .setFooter({
                text: `${process.env.DISCORD_BOT_NAME} by Solare`,
                iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4'
            });

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    } catch (error) {
        console.error("Error while sending menu: ", error);
    }
}

module.exports = { sendList };
