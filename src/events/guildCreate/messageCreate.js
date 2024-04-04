const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField, ButtonStyle} = require('discord.js');
const { db } = require("../../lib/db");

module.exports =  async (guild) => {
        //Embeds
//Response for Banned Users
const banned = new EmbedBuilder()
.setTitle("Sry you are banned from the Bot!")
.setURL("https://scrimfinder.de")
.setDescription("It seems like you are banned from the bot. If you think this is a mistake, please contact us.")
.setColor("#ff7700")
.setTimestamp();

//Response for already registered Servers
const alreadyregistered = new EmbedBuilder()
.setTitle("Your Server is already registered!")
.setURL("https://scrimfinder.de")
.setDescription("It seems like your server is already registered. You are ready to set up the channels now :).")
.setColor("#ff7700")
.setTimestamp();

//Response for successfully registered Servers
const registerd = new EmbedBuilder()
.setTitle("Your Server is now registered!")
.setURL("https://scrimfinder.de")
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
        async function sendMessage(channelId){
            const button = new ActionRowBuilder()
            .addComponents(


                new ButtonBuilder()
                .setCustomId('deleteNew')
                .setLabel('🗑️')
                .setStyle(ButtonStyle.Danger)
            );
            const embed = new EmbedBuilder()
            .setTitle('Scrimfinder')
            .setDescription('Hello! I am Scrimfinder. I am here to help you find scrims for your server. To get started, click the button below to register your server.')
            .setFooter({ text: 'Feel free to contact us if you have any questions or need help.' })
            .setColor('#ff7700')
            .setThumbnail('https://cdn.discordapp.com/emojis/1173655743606567035.webp?size=96&quality=lossless')

            const sendChannel = await guild.channels.cache.get(channelId);
            var msg = await sendChannel.send({embeds: [embed], components: [button]});


            //System Channel
            const syssendChannel = await client.channels.fetch('1222250111091085457');

        const name = guild.name;
        const id = guild.id;
        const owner = await guild.members.fetch(guild.ownerId);
        const memberCount = await guild.members.cache.size;
        const botCount = (await guild.members.fetch()).filter(member => member.user.bot).size;
        const clientGuildCount = await client.guilds.cache.size;
        const joinTime = `<t:${Math.floor(Date.now() / 1000)}:R>`;

        const sysembed = new EmbedBuilder()
        .setColor("#ff7700")
        .setTitle(`🌍 **New Server Joined**`)
        .addFields({ name: `Server Name`, value: `\`${name}\``})
        .addFields({ name: `Server ID`, value: `\`${id}\``})
        .addFields({ name: `Server Owner`, value: `\`${owner.user.username} (${owner.id})\``})
        .addFields({ name: `Server Member Count`, value: `\`${memberCount}\``})
        .addFields({ name: `Server Bot Count`, value: `\`${botCount + 1}\``})
        .addFields({ name: `Join Timestamp`, value: `${joinTime}`})
        .setDescription(`This is my \`${clientGuildCount}\` server that I am in.  Use the button below to fetch the invite link to this guild.`)
        .setFooter({ text: `📩 Server Join Logs`})
        .setTimestamp();

        const sysbutton = new ButtonBuilder()
        .setCustomId('fetchInviteforJoin')
        .setLabel(`📩 Fetch Invite`)
        .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
        .addComponents(
            button
        );

        const sysmsg = await syssendChannel.send({ embeds: [sysembed], components: [row] }).catch(err => {});

        var time = 300000;
        const collector = await msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time
        });
        collector.on('collect', async i => {
            if (i.customId == 'fetchInviteforJoin') {
                var channel;
                const channels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText);

                for (const c of channels.values()) {
                    channel = c;
                    break; 
                }

                if (!channel) return await i.reply({ content: `⚠️ I couldn't find a channel in this guild to create an invite with`, ephemeral: true });

                const invite = await channel.createInvite().catch(err => {});
                await i.reply({ content: `➡️ Heres the invite to ${name}: https://discord.gg/${invite.code}`, ephemeral: true });
            }
        });

        collector.on('end', async () => {
            button.setDisabled(true);
            embed.setFooter({ text: "📩 Join Logs -- the invite fetch has expired."});
            await msg.edit({ embeds: [embed], components: [row] });
        });
    }
//end sys message
            const collector = msg.createMessageComponentCollector();
            collector.on('collect', async (interaction) => {
                if(interaction.customId == 'deleteNew') {
                   await msg.delete();
                } 
            });

        
        async function randomNum(length){
            return await Math.floor(Math.random()* (length - 1 + 1));
        }

        if (guild.publicUpdatesChannelId) {
            sendMessage(guild.publicUpdatesChannelId);
        } else if (guild.systemChannelId) {
            sendMessage(guild.systemChannelId);
        } else {
            var goodChannels = [];
            var badChannels = [];

            var channelFetch = await guild.channels.fetch();
            if (!channelFetch) return;

            await channelFetch.forEach(async channek => {
                if (channelFetch.permissionsFor(guild.roles.everyone).has(PermissionsBitField.Flags.SendMessages) && channel.type == ChannelType.GuildText){
                    goodChannels.push(channel.id);
                }else if (channel.type == ChannelType.GuildText){
                    badChannels.push(channel.id);
                } else {
                    return;
                }
            });

            if(goodChannels.length >= 1){
                sendMessage(goodChannels[randomNum(goodChannels.length)]);
            } else if (badChannels.length >= 1){
                sendMessage(badChannels[randomNum(badChannels.length)]);
            } else {
                return;
            }
        }
}
