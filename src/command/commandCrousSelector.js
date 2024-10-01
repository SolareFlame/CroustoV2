const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const locations = require('../../locations.json');

module.exports = {
    // Set a location
    async SetLocation() {
        const select = new StringSelectMenuBuilder()
            .setPlaceholder('Sélectionnez votre Crous')
            .setCustomId('location_selector')
            .addOptions(
                locations.map(location => new StringSelectMenuOptionBuilder()
                    .setLabel(location.name)
                    .setDescription(location.desc || 'Aucune description')
                    .setValue(location.id.toString())
                )
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        return row;
    },

    // Set a channel
    async SetChannel(guild) {
        if (!guild || !guild.channels || !guild.channels.cache) {
            throw new Error('Guild or channels cache is undefined.');
        }

        const channels = guild.channels.cache
            .filter(channel => channel.isTextBased())
            .map(channel => new StringSelectMenuOptionBuilder()
                .setLabel(channel.name)
                .setValue(channel.id)
            );

        const select = new StringSelectMenuBuilder()
            .setPlaceholder('Sélectionnez le channel')
            .setCustomId('channel_selector')
            .addOptions(channels);

        const row = new ActionRowBuilder()
            .addComponents(select);

        return row;
    },

    // Set a role
    async SetRole(guild) {
        if (!guild || !guild.roles || !guild.roles.cache) {
            throw new Error('Guild or roles cache is undefined.');
        }

        const roles = guild.roles.cache
            .map(role => new StringSelectMenuOptionBuilder()
                .setLabel(role.name)
                .setValue(role.id)
            );

        const select = new StringSelectMenuBuilder()
            .setPlaceholder('Sélectionnez le rôle')
            .setCustomId('role_selector')
            .addOptions(roles);

        const row = new ActionRowBuilder()
            .addComponents(select);

        return row;
    },

    // Set a date (by modal entry)
    async SetDate() {
        const select = new StringSelectMenuBuilder()
            .setPlaceholder('Sélectionnez votre horaire')
            .setCustomId('date_selector')
            .addOptions(
                Array.from({ length: 24 }, (_, i) => i).map(hour => new StringSelectMenuOptionBuilder()
                    .setLabel(`${hour.toString().padStart(2, '0')}:00`)
                    .setValue(hour.toString())
                )
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        return row;
    }
};
