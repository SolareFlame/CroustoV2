require('dotenv').config();
const { Client, GatewayIntentBits, Events, ActivityType } = require('discord.js');
const { SetLocation, SetChannel, SetRole, SetDate } = require('./selector_crous');
const {deploy} = require("./deploy-commands");

let data = [];


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.once('ready', () => {
    console.log(`${process.env.DISCORD_BOT_NAME} logged in as ${client.user.tag}`);
    client.user.setActivity("les menus du jour", { type: ActivityType.Watching });

    deploy();
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isCommand()) {
        if (interaction.commandName === 'new') {
            await interaction.reply({
                content: "Sélectionnez votre Crous :",
                components: [await SetLocation()],
                ephemeral: true
            });
        }
    }

    if (interaction.isStringSelectMenu()) {

        // Get the location
        if (interaction.customId === 'location_selector') {
            data.push(interaction.values[0]);

            await interaction.deferUpdate();

            await interaction.editReply({
                content: `Sélection: ${data[0]}`,
                components: [await SetChannel(interaction.guild)],
                ephemeral: true
            });

        }

        // Get the channel
        if (interaction.customId === 'channel_selector') {
            data.push(interaction.values[0]);

            await interaction.deferUpdate();

            await interaction.editReply({
                content: `Sélection: ${data[1]}`,
                components: [await SetRole(interaction.guild)],
                ephemeral: true
            });
        }

        // Get the role
        if (interaction.customId === 'role_selector') {
            data.push(interaction.values[0]);

            await interaction.deferUpdate();

            await interaction.editReply({
                content: `Sélection: ${data[2]}`,
                components: [await SetDate()],
                ephemeral: true
            });
        }

        // Get the date
        if(interaction.customId === 'date_selector') {
            data.push(interaction.values[0]);

            await interaction.deferUpdate();

            await interaction.editReply({
                content: `Sélection: ${data}`,
                components: [],
                ephemeral: true
            });
        }
    }
});

client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error("Erreur lors de la connexion du bot :", error);
});
