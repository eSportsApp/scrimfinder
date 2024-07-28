const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { db } = require("../../lib/db");
const { set } = require("mongoose");
//const {banned} = require("../lib/embeds");


module.exports = {
  run: async ({ interaction }) => {
 // Check if user is in the database
 const userInDB = await db.users.findFirst({
  where: {
    userId: interaction.user.id,
  },
});
if (!userInDB) {
  // Create user in the database if not exists
  await db.users.create({
    data: {
      userId: interaction.user.id,
      username: interaction.user.username,
      rssclass: "I",
    },
  });
}

//Embeds declaration

//no permissions
const noperm = new EmbedBuilder()
.setTitle("You don't have the permissions to use this command!")
.setURL("https://scrimfinder.gg")
.setDescription("You don't have the permissions to use this command. You can [Invite me](https://docs.scrimfinder.de/invite) to your server to use this command. If you think this is a mistake, please contact us.")
.setColor("#ff7700")
.setTimestamp();

//Response for Banned Users
const banned = new EmbedBuilder()
.setTitle("Sry you are banned from the Bot!")
.setURL("https://scrimfinder.gg")
.setDescription("It seems like you are banned from the bot. If you think this is a mistake, please contact us.")
.setColor("#ff7700")
.setTimestamp();

//Response for already registered Servers
const alreadyregistered = new EmbedBuilder()
.setTitle("This Channel is already set up!")
.setURL("https://scrimfinder.gg")
.setDescription("It seems like this channel is already set up. Please try another one!\n\n If you need help, visit our [docs](https://docs.scrimfinder.de) or join our [Support Server](https://discord.gg/Ud42T9qPKw)\n\nTo get started just try /findscrim")
.setColor("#ff7700")
.setTimestamp();

//Response for successfully registered Servers
const success = new EmbedBuilder()
.setTitle("Successfully set up the channel!")
.setURL("https://scrimfinder.gg")
.setDescription("Successfully set up the channel for the game. You are ready to use me now.\n\n If you need help, visit our [docs](https://docs.scrimfinder.de) or join our [Support Server](https://discord.gg/Ud42T9qPKw)\n\nTo get started just try /findscrim")
.setColor("#ff7700")
.setTimestamp();

//Response for successfully set up channel
const setchannel = new EmbedBuilder()
.setTitle("Successfully set up the channel!")
.setURL("https://scrimfinder.gg")
.setDescription("You successfully set up the channel. Feel free to serch a scrim using /findscrim\n\n If you need help, visit our [docs](https://docs.scrimfinder.de) or join our [Support Server](https://discord.gg/Ud42T9qPKw)")
.setColor("#ff7700")
.setTimestamp();

//Buttons
const invite = new ActionRowBuilder()
.addComponents(
    new ButtonBuilder()
        .setURL('https://docs.scrimfinder.de/invite')
        .setLabel('Test me out')
        .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
        .setURL('https://discord.gg/Ud42T9qPKw')
        .setLabel('Join the Support Server')
        .setStyle(ButtonStyle.Link),
)

//code
    const channel = interaction.options.getChannel("channel");
    const game = interaction.options.getString("game");
    const range = interaction.options.getString("range");
    const guildId = interaction.guildId;

    try {
let guildDB = await db.guilds.findFirst({
  where: {
    guildId: guildId
  } 
});
      if(guildDB) {
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.Flags.Administrator
          )
        ) {
          await interaction.reply({ 
            embeds: [noperm], 
            components: [invite] })
        }
  
        const userBanned = await db.bannedUsers.findFirst({
          where: {
            userId: interaction.user.id,
          },
        });
  
        if (userBanned) {
          await interaction.reply({ 
            embeds: [banned]});
          return;
        }
  
        const guildDB = await db.guilds.findFirst({
          where: {
            guildId: guildId
          }
        })
        if (game == "rss") {
          if (range == "default") {
          const guildDB = await db.guilds.findFirst({
            where: {
              guildId: guildId
            }
          })
        
          if(guildDB && guildDB.rssGtoIid && guildDB.rssGtoIid.includes(channel.id)) {
            await interaction.reply({ 
              embeds: [alreadyregistered]
            });
            return;
          }
        
          let rssGtoIid = guildDB && guildDB.rssGtoIid ? [...guildDB.rssGtoIid, channel.id] : [channel.id];
        
          const newChannelDB = await db.guilds.update({
            where: {
              guildId: guildId
            },
            data: {
              rssGtoIid: rssGtoIid
            }
          })
        
          const setupChannel = await interaction.guild.channels.cache.get(channel.id);
          try {
            await setupChannel.send({ 
              embeds: [setchannel]
            });
            await interaction.reply({ 
              embeds: [success]
            });
          } catch (error) {
            await interaction.reply({ 
              content: "Missing permissions to send messages in the specified channel."
            });
          }
          //
        }  else if (range == "df") {
          let userInDB2 = await db.users.findFirst({
            where: {
              userId: interaction.user.id,
            },
          });
          if (!userInDB2) {
            // Create user in the database if not exists
            userInDB2 = await db.users.create({
              data: {
                userId: interaction.user.id,
                username: interaction.user.username,
                rssclass: "I",
              },
            });
          }
          
          const rssClass = userInDB2.rssclass;
          
          
          if (rssClass === "I" || rssClass === "H" || rssClass === "G") {
            await interaction.reply("You are not allowed to set up a channel for this class range.");
            return;
          }
          const guildDB = await db.guilds.findFirst({
            where: {
              guildId: guildId
            }
          })
        
          if(guildDB && guildDB.rssDtoFid && guildDB.rssDtoFid.includes(channel.id)) {
            await interaction.reply({ 
              embeds: [alreadyregistered]
            });
            return;
          }
        
          let rssDtoFid = guildDB && guildDB.rssDtoFid ? [...guildDB.rssDtoFid, channel.id] : [channel.id];
        
          const newChannelDB = await db.guilds.update({
            where: {
              guildId: guildId
            },
            data: {
              rssDtoFid: rssDtoFid
            }
          })
        
          const setupChannel = await interaction.guild.channels.cache.get(channel.id);
          try {
            await setupChannel.send({ 
              embeds: [setchannel]
            });
            await interaction.reply({ 
              embeds: [success]
            });
          } catch (error) {
            await interaction.reply({ 
              content: "Missing permissions to send messages in the specified channel."
            });
            
          }
        }
    }
    }} catch (err) {
      console.log(err);
    }
  },
  data: new SlashCommandBuilder()
    .setName("setup-scrim")
    .setDescription("Setup a channel to get the scrim search messages.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel you want to use.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription(
          "The game you want to get notifications for in the channel."
        )
        .addChoices({ name: "Rainbow Six Siege", value: "rss" })
        .setRequired(true)
        
    )
    .addStringOption((option) =>
      option
        .setName("range")
        .setDescription(
          "The class range you want to see in the channel."
        )
        .addChoices({ name: "G-I", value: "default" })
        .addChoices({ name: "D-F", value: "df" })
        .setRequired(true)
        
    ),
    integration_types: [
      0, // GUILD
    ],
    contexts: [
      0, // GUILD
      2, // PRIVATE_CHANNEL
    ],
};
