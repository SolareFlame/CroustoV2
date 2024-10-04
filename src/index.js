require('dotenv').config();
const { Client, GatewayIntentBits, Events, ActivityType } = require('discord.js');
const { SetLocation, SetChannel, SetRole, SetDate } = require('./command/commandCrousSelector');
const { deploy } = require("./command/deployCommands");

const { setPing } = require('./editor/sendListEditor');
const { existsRestaurant } = require('./editor/restaurants');
const { directMenu } = require("./menu/renderMenu");
const { today } = require("./menu/getMenu");
const { sendMenu } = require("./command/commandSendMenu");
const { startChecking } = require("./startChecking");
const { sendInfo } = require("./command/commandSendInfo");

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

    startChecking(client);
});

client.on(Events.InteractionCreate, async interaction => {
    try {
        if (interaction.isCommand()) {
            if (interaction.commandName === 'new') {
                if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                    await interaction.reply({
                        content: "Vous n'avez pas les permissions nécessaires pour effectuer cette commande.",
                        ephemeral: true
                    });
                    return;
                } else {
                    await interaction.reply({
                        content: "Sélectionnez votre Crous :",
                        components: [await SetLocation()],
                        ephemeral: true
                    });
                    return;  // Stop further execution
                }
            }

            if (interaction.commandName === 'menu') {
                let id = parseInt(interaction.options.getString('id'));

                if (!existsRestaurant(id)) {
                    console.log("ID invalide");
                    await interaction.reply({ content: "ID invalide", ephemeral: true });
                    return;
                }

                let menu = await directMenu(id, today(), interaction.options.getString('repas'));

                if (!menu) {
                    await interaction.reply({
                        content: "Erreur lors de la récupération du menu.",
                        ephemeral: true
                    });
                    return;
                }

                await sendMenu(interaction, menu, id);
                console.log("Menu envoyé avec succès.");
                return; // Stop further execution
            }

            if (interaction.commandName === 'info') {
                let id = parseInt(interaction.options.getString('id'));

                if (!existsRestaurant(id)) {
                    console.log("ID invalide");
                    await interaction.reply({ content: "ID invalide", ephemeral: true });
                    return;
                }

                await sendInfo(interaction, id);
                console.log("Information envoyée avec succès.");
                return; // Stop further execution
            }
        }

        if (interaction.isStringSelectMenu()) {
            await interaction.deferUpdate(); // Defer first to prevent timeout

            if (interaction.customId === 'location_selector') {
                const locationId = interaction.values[0];

                await interaction.editReply({
                    content: `Location: ${locationId}`,
                    components: [await SetChannel(interaction.guild)],
                    ephemeral: true
                });
                return; // Stop further execution
            }

            if (interaction.customId === 'channel_selector') {
                const channelId = interaction.values[0];

                await interaction.editReply({
                    content: `Channel: ${channelId}`,
                    components: [await SetRole(interaction.guild)],
                    ephemeral: true
                });
                return; // Stop further execution
            }

            if (interaction.customId === 'role_selector') {
                const roleId = interaction.values[0];

                await interaction.editReply({
                    content: `Role: ${roleId}`,
                    components: [await SetDate()],
                    ephemeral: true
                });
                return; // Stop further execution
            }

            if (interaction.customId === 'date_selector') {
                const selectedDate = interaction.values[0];

                await interaction.editReply({
                    content: `Date: ${selectedDate}`,
                    components: [],
                    ephemeral: true
                });

                console.log(`Data ajoutée : ${selectedDate}`);
                return; // Stop further execution
            }
        }

        if (interaction.isButton() && interaction.customId && interaction.customId.startsWith('info_')) {
            const id = interaction.customId.split('_')[1];
            await sendInfo(interaction, parseInt(id));
        }

    } catch (error) {
        console.error("Error handling interaction: ", error);
        await interaction.reply({
            content: "Une erreur s'est produite lors de l'interaction.",
            ephemeral: true
        });
    }
});

client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error("Erreur lors de la connexion du bot :", error);
});

