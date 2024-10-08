const { EmbedBuilder } = require('discord.js');
const {filterRestaurants, getRestaurant} = require("../editor/restaurants");
const fs = require('fs');
const {today, renderDate} = require("../menu/getMenu");
require('dotenv').config();

async function sendHelp(interaction) {
    try {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: process.env.DISCORD_BOT_NAME,
                url: process.env.GITHUB_URL,
                iconURL: process.env.LOGO_1_URL
            })
            .setColor(0xE30613)
            .setTitle("Menu d\'aide " + process.env.DISCORD_BOT_NAME)
            .setDescription("Voici la liste des commandes disponibles pour "+ process.env.DISCORD_BOT_NAME +" :")
            .addFields({
                name: 'new',
                value: `Met en place une notification quotidienne pour les menus du jour.\n Cette commande n'est réservée qu'aux administrateurs.\n Il ne peut qu'y avoir une seule notification par **salon**.\n`,
                inline: false
            },
            {
                name: 'menu',
                value: `Donne le menu du jour pour un restaurant donné et un repas donné.\n Usage: /menu (restaurant) (repas)\n`,
                inline: false
            },
            {
                name: 'info',
                value: `Affiche les informations sur un restaurant.\n Usage: /info (restaurant)\n`,
                inline: false
            },
            {
                name: 'list',
                value: `Affiche la liste des restaurants.\n Usage: /list\n`,
                inline: false
            },
            {
                name: 'clear',
                value: `Supprime la notification quotidienne pour les menus du jour.\n Cette commande n'est réservée qu'aux administrateurs.\n`,
                inline: false
            })

            .setThumbnail(process.env.LOGO_1_URL)
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

module.exports = { sendHelp };
