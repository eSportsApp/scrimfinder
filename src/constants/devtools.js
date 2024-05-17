const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { db } = require("../lib/db");
const os = require("os");
function createInfoEmbed(client) {
    let totalSecs = (client.uptime / 1000);
    let days = Math.floor(totalSecs / 86400);totalSecs %= 86400;
    let hrs = Math.floor(totalSecs / 3600);totalSecs %= 3600;
    let mins = Math.floor(totalSecs / 60);
    let seconds = Math.floor(totalSecs % 60);
    let uptime = `**${days}**d **${hrs}**h **${mins}**m **${seconds}**s`;

    const infoEmbed = new EmbedBuilder()
    .setColor("#ff7700")
    .setTitle('> Scrimfinder Devtools')
    .setURL('https://scrimfinder.gg')
    .setFooter({ text: `Scrimfinder devtools.`, 
    iconURL: `https://maierfabian.de/images/lovepingu.png`})
    .setThumbnail('https://maierfabian.de/images/lovepingu.png')
    .setTimestamp()
    .addFields({ name: `**🛠️ STATS**`, value: `> Bots current stats`, inline: false})
.addFields({ name: `Server Count: `, value: `> **${client.guilds.cache.size}**`, inline: true})
.addFields({ name: `Member Count: `, value: `> **${client.guilds.cache.reduce((a,b) => a+b.memberCount, 0)}**`, inline: true})
.addFields({ name: `Latency: `, value: `> **${Math.round(client.ws.ping)}ms**`, inline: true})
.addFields({ name: `Uptime`, value: `> ${uptime}`, inline: true })
.addFields({ name: `Platform: `, value: `> **${os.platform()}**`, inline: true})
.addFields({ name: `OS Version: `, value: `> **${os.release()}**`, inline: true})
.addFields({ name: `CPU: `, value: `> **${os.cpus()[0].model}**`, inline: true})
.addFields({ name: `CPU Cores: `, value: `> **${os.cpus().length / 2}**`, inline: true})
.addFields({ name: `Total RAM: `, value: `> **${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB**`, inline: true})
.addFields({ name: `Storage Used: `, value: `> **${((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2)} GB**`, inline: true});

    return infoEmbed;
}

async function register(interaction) {
    const alreadyregistered = new EmbedBuilder()
    .setTitle("Your Server is already registered!")
    .setURL("https://scrimfinder.gg")
    .setDescription("It seems like your server is already registered. You didn't register don't worry the bot did this by himself. You are ready to set up the channels now :).")
    .setColor("#ff7700")
    .setTimestamp();

//Response for successfully registered Servers
const registerd = new EmbedBuilder()
    .setTitle("Your Server is now registered!")
    .setURL("https://scrimfinder.gg")
    .setDescription("Successfully registered your server! Have fun using this bot :). \n\n If you need help, visit our [docs](https://docs.scrimfinder.de) or join our [Support Server](https://discord.gg/division-league-833783529506078781)")
    .setColor("#ff7700")
    .setTimestamp();
//Buttons
const docs = new ActionRowBuilder()
.addComponents(
  new ButtonBuilder()
      .setURL('https://docs.scrimfinder.de')
      .setLabel('Visit the docs')
      .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
      .setURL('https://discord.gg/division-league-833783529506078781')
      .setLabel('Join the Support Server')
      .setStyle(ButtonStyle.Link),
)



      
    try {
        
        const guildId = interaction.guildId;

        const bannedUser = await db.bannedUsers.findFirst({
            where: {
                userId: interaction.user.id
            }
        })

        if(bannedUser) {
            await interaction.reply({ 
                embeds: [banned], 
                components: [docs] })
        }

        const guildDB = await db.guilds.findFirst({
            where: {
                guildId: guildId
            }
        })

        if(guildDB) {
            await interaction.reply({ 
                embeds: [alreadyregistered], 
                components: [docs] })
        }else {

        const newDBGuild = await db.guilds.create({
            data: {
                guildId: guildId,
            }
        })

        await interaction.reply({ 
            embeds: [registerd], 
            components: [docs] })}

    } catch (err) {
        console.log(err)
    }

}
function sayHello(name) {
    return `Hello, ${name}!`;
}

async function leave(searchId, interaction, client) {
    const serverId = searchId.split(' ')[1];
            const guild = client.guilds.cache.get(serverId);
            if (guild) {
                await guild.leave();
                await interaction.reply({ content: `Left the server with ID ${serverId}.`, ephemeral: false });
            } else {
                await interaction.reply({ content: `No server found with the ID ${serverId}.`, ephemeral: false });
            }
    return 
}

async function guilddata (searchId, interaction){
    const serverId = searchId.split(' ')[1];
                const guildData = await db.guilds.findUnique({
                    where: {
                        guildId: serverId,
                    },
                });
                if (guildData) {
                    const rssGtoIChannels = guildData.rssGtoIid.join('\n');
                    const rssDtoFChannels = guildData.rssDtoFid.join('\n');
                    await interaction.reply({ content: `Channels for server ${serverId}:\n\nrssGtoI Channels:\n${rssGtoIChannels}\n\nrssDtoF Channels:\n${rssDtoFChannels}`, ephemeral: false });
                } else {
                    await interaction.reply({ content: `No server found with the ID ${serverId}.`, ephemeral: true });
                }
}

async function deluser (searchId, interaction, client){
    const userId = searchId.split(' ')[1];
    const user = await db.users.findUnique({
        where: {
            userId: userId,
        },
        include: {
            messages: true,
        },
    });
    if (user) {
        await interaction.deferReply({ ephemeral: true });
        // Delete all messages of the user from the database and the channels
        for (const searchMessage of user.messages) {
            for (let i = 0; i < searchMessage.messageIds.length; i++) {
                const guildId = searchMessage.guildIds[i];
                const channelId = searchMessage.channelIds[i];
                console.log(`Fetching channel ${channelId} from guild ${guildId}`);
                const guild = await client.guilds.fetch(guildId);
                if (!guild) {
                    console.error(`Guild ${guildId} not found`);
                    continue;
                }
                const channel = await client.channels.fetch(channelId);
                if (!channel) {
                    console.error(`Channel ${channelId} not found`);
                    continue;
                }
                let discordMessage;
                try {
                    discordMessage = await channel.messages.fetch(searchMessage.messageIds[i]);
                } catch (error) {
                    console.error(`Message ${searchMessage.messageIds[i]} not found`);
                    continue;
                }
                // Delete the message in Discord
                try {
                    await discordMessage.delete();
                } catch (error) {
                    console.error(`Failed to delete message: ${error}`);
                }
            }
            // Delete the message from the database
            await db.message.delete({
                where: {
                    id: searchMessage.id,
                },
            });
        }
        await interaction.editReply({content: 'Search closed', ephemeral: true});
    } else {
        await interaction.reply({ content: `No user found with the ID ${userId}.`, ephemeral: false });
    }
    return;

}
module.exports = {
    sayHello: sayHello,
    createInfoEmbed: createInfoEmbed,
    register: register,
    leave: leave,
    guilddata: guilddata,
    deluser: deluser,
};