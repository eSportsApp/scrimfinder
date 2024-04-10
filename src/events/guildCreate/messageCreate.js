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
    }}
