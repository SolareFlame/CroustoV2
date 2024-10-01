const { EmbedBuilder } = require('discord.js');


async function sendMenu(interaction, menu) {
    try {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Menu du Jour !')
            .setDescription(`ALPHA`)
            .addFields({
                name: "Menu:",
                value: menu,
                inline: false
            })
            .setThumbnail('\n' +
                'https://cdn.discordapp.com/avatars/1284499356963307610/638b450a2046175395cd4ff5789c8e14?size=256.png')
            .setTimestamp()
            .setFooter({text: 'Ulmenu by Solare', iconURL: 'https://avatars.githubusercontent.com/u/88492960?v=4'});

        // Send the embed to the channel
        await interaction.reply({
            embeds: [embed],
            ephemeral: false
        });
    } catch (error) {
        console.error("Error while sending menu: ", error);
    }
}

module.exports = { sendMenu };