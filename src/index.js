require('dotenv').config();
const { Client, GatewayIntentBits, Events, ActivityType } = require('discord.js');
const { SetLocation, SetChannel, SetRole, SetDate } = require('./command/commandCrousSelector');
const { deploy } = require("./command/deployCommands");

const { setPing } = require('./editor/sendListEditor');
const {getLocation} = require("./editor/locationEditor");
const {directMenu} = require("./menu/renderMenu");
const {today} = require("./menu/getMenu");
const {sendMenu} = require("./command/commandSendMenu");

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



        if (interaction.commandName === 'menu') {
            let id = interaction.options.getNumber('id');

            //vérifier l'existance de l'id
            if (getLocation(id)) {
                console.log("ID valide");
            } else {
                console.log("ID invalide");
                return;
            }

            let menu = await directMenu(id, today(), interaction.options.getString('repas'))

            if (menu === null) {
                await interaction.reply({
                    content: "Erreur lors de la récupération du menu.",
                    ephemeral: true
                });
                return;
            }

            sendMenu(interaction, menu).then(() => {
                console.log("Menu envoyé avec succès.");
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

            console.log("Data ajoutée :" + data[0] + " " + data[1] + " " + data[2] + " " + data[3]);

            setPing(data[0], data[1], data[2], data[3], "../sendList.json");
        }
    }
});

client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error("Erreur lors de la connexion du bot :", error);
});
