const { ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const locations = require('../locations.json');
console.log(locations);

async function setupModal(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('setup_modal')
        .setTitle('Configuration ping');

    const location_selector = new StringSelectMenuBuilder()
        .setCustomId('location_selector')
        .setPlaceholder("Selectionnez votre Crous")
        .addOptions(
            Object.values(locations).map(location => new StringSelectMenuOptionBuilder()
                .setLabel(location.name)
                .setDescription(location.desc)
                .setValue(location.name)
            )
        );

    const time_selector = new TextInputBuilder()
        .setCustomId('time_selector')
        .setLabel("L'heure souhaitée")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const role_selector = new StringSelectMenuBuilder()
        .setCustomId('role_selector')
        .setPlaceholder("Selectionnez le rôle à ping")
        .addOptions(
            interaction.guild.roles.cache.map(role => new StringSelectMenuOptionBuilder()
                .setLabel(role.name)
                .setValue(role.id)
            )
        );

    // Remplacer .addComponent par .addComponents
    modal.addComponents(
        new ActionRowBuilder().addComponents(location_selector),
        new ActionRowBuilder().addComponents(time_selector),
        new ActionRowBuilder().addComponents(role_selector)
    );

    await interaction.showModal(modal);
}

module.exports = { setupModal };
