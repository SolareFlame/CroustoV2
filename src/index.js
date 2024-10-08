require('dotenv').config();
const { Client, GatewayIntentBits, Events, ActivityType } = require('discord.js');

const { SetLocation, SetChannel, SetRole, SetDate } = require('./command/commandCrousSelector');
const { deploy } = require("./command/deployCommands");

const { setPing, existPing, removePing} = require('./editor/sendListEditor');
const { startChecking } = require("./startChecking");
const { sendInfo } = require("./command/commandSendInfo");
const {existsRestaurant, getRestaurant} = require("./editor/restaurants");
const {directMenu} = require("./menu/renderMenu");
const {today} = require("./menu/getMenu");
const {sendMenu} = require("./command/commandSendMenu");
const {sendHelp} = require("./command/commandHelp");

const { PermissionsBitField } = require('discord.js');
const {sendList} = require("./command/commandSendList");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const userData = {};

client.once('ready', () => {
    console.log(`${process.env.DISCORD_BOT_NAME} logged in as ${client.user.tag}`);
    client.user.setActivity("les menus du jour", { type: ActivityType.Watching });

    deploy();
    startChecking(client);
});

client.on(Events.InteractionCreate, async interaction => {
    try {
        if (interaction.isCommand()) {
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
                        content: "Aucun repas du **" + interaction.options.getString('repas') + "** trouvé pour aujourd'hui.",
                        ephemeral: true
                    });
                    return;
                }

                await sendMenu(interaction, menu, id);
                console.log("Menu envoyé avec succès.");
                return;
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
                return;
            }

            if (interaction.commandName === 'help') {
                await sendHelp(interaction);
                return;
            }

            if (interaction.commandName === 'clear') {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    await interaction.reply({
                        content: "Vous n'avez pas les permissions nécessaires pour effectuer cette commande.",
                        ephemeral: true
                    });
                    return;
                }

                let channel = interaction.options.getChannel('channel');

                if (!channel) {
                    await interaction.reply({
                        content: "Channel invalide",
                        ephemeral: true
                    });
                    return;
                }

                if(!existPing(channel.id)) {
                    await interaction.reply({
                        content: "Aucune notification quotidienne n'est configurée pour ce channel. (/list)",
                        ephemeral: true
                    });
                    return;
                }

                await removePing(channel.id, "../sendList.json");

                await interaction.reply({
                    content: "Notification quotidienne supprimée pour le channel <#" + channel + ">",
                    ephemeral: true
                });

                console.log("Notification quotidienne supprimée pour le channel " + channel);
                return;
            }


            if (interaction.commandName === 'list') {
                await sendList(interaction, client, interaction.guild.id);
                return;
            }

            /*
            ------------------- /NEW -------------------
             */

            if (interaction.commandName === 'new') {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    await interaction.reply({
                        content: "Vous n'avez pas les permissions nécessaires pour effectuer cette commande.",
                        ephemeral: true
                    });
                    return;
                } else {
                    userData[interaction.user.id] = [];
                    await interaction.reply({
                        content: "Sélectionnez votre Crous :",
                        components: [await SetLocation()],
                        ephemeral: true
                    });
                    return;
                }
            }
        }

        if (interaction.isStringSelectMenu()) {
            await interaction.deferUpdate();

            const userResponses = userData[interaction.user.id] || [];

            if (interaction.customId === 'location_selector') {
                userResponses[0] = interaction.values[0];
                userData[interaction.user.id] = userResponses;

                await interaction.editReply({
                    content: `Sélectionnez le channel où vous souhaitez recevoir les notifications :`,
                    components: [await SetChannel(interaction.guild)],
                    ephemeral: true
                });
                return;
            }

            if (interaction.customId === 'channel_selector') {
                userResponses[1] = interaction.values[0];
                userData[interaction.user.id] = userResponses;

                await interaction.editReply({
                    content: `Sélectionnez le rôle qui recevra les notifications :`,
                    components: [await SetRole(interaction.guild)],
                    ephemeral: true
                });
                return;
            }

            if (interaction.customId === 'role_selector') {
                userResponses[2] = interaction.values[0];
                userData[interaction.user.id] = userResponses;

                await interaction.editReply({
                    content: `Sélectionnez l'heure à laquelle vous souhaitez recevoir les notifications :`,
                    components: [await SetDate()],
                    ephemeral: true
                });
                return;
            }

            if (interaction.customId === 'date_selector') {
                userResponses[3] = interaction.values[0];
                userData[interaction.user.id] = userResponses;

                await interaction.editReply({
                    content: `Une notification automatique sera envoyée pour le \`Crous ${getRestaurant(parseInt(userResponses[0]))[0].title}\` dans le channel <#${userResponses[1]}> pour le rôle <@&${userResponses[2]}> à \`${userResponses[3]}:00h\` tous les jours.`,
                    components: [],
                    ephemeral: true
                });

                console.log(`Data ajoutée : ${userResponses}`);

                await setPing(userResponses[0], userResponses[1], userResponses[2], userResponses[3], "../sendList.json");
                delete userData[interaction.user.id];
                return;
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
