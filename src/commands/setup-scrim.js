const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { db } = require("../lib/db");
//const {banned} = require("../lib/embeds");


module.exports = {
  run: async ({ interaction }) => {


//Embeds declaration

//no permissions
const noperm = new EmbedBuilder()
.setTitle("You don't have the permissions to use this command!")
.setURL("https://scrimfinder.de")
.setDescription("You don't have the permissions to use this command. You can [Invite me](https://docs.scrimfinder.de/invite) to your server to use this command. If you think this is a mistake, please contact us.")
.setColor("#ff7700")
.setTimestamp();

//Response for Banned Users
const banned = new EmbedBuilder()
.setTitle("Sry you are banned from the Bot!")
.setURL("https://scrimfinder.de")
.setDescription("It seems like you are banned from the bot. If you think this is a mistake, please contact us.")
.setColor("#ff7700")
.setTimestamp();

//Response for already registered Servers
const alreadyregistered = new EmbedBuilder()
.setTitle("This Channel is already set up!")
.setURL("https://scrimfinder.de")
.setDescription("It seems like this channel is already set up. Please try another one!\n\n If you need help, visit our [docs](https://docs.scrimfinder.de) or join our [Support Server](https://discord.gg/division-league-833783529506078781)\n\nTo get started just try /findscrim")
.setColor("#ff7700")
.setTimestamp();

//Response for successfully registered Servers
const success = new EmbedBuilder()
.setTitle("Successfully set up the channel!")
.setURL("https://scrimfinder.de")
.setDescription("Successfully set up the channel for the game. You are ready to use me now.\n\n If you need help, visit our [docs](https://docs.scrimfinder.de) or join our [Support Server](https://discord.gg/division-league-833783529506078781)\n\nTo get started just try /findscrim")
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
        .setURL('https://discord.gg/division-league-833783529506078781')
        .setLabel('Join the Support Server')
        .setStyle(ButtonStyle.Link),
)

//code
    const channel = interaction.options.getChannel("channel");
    const game = interaction.options.getString("game");
    const guildId = interaction.guildId;

    try {
      const guildDB = await db.guilds.findFirst({
        where: {
          guildId: guildId
        }
      })

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
  
        if (game == "valo") {
  
          const checkDB = await db.guilds.findFirst({
            where: {
              valoChannelId: channel.id
            }
          })
  
          if(checkDB) {
            await interaction.reply({ 
              embeds: [alreadyregistered]})
          }
  
          const newChannelDB = await db.guilds.update({
            where: {
              guildId: guildId
            },
            data: {
              valoChannelId: channel.id
            }
          })
  
          await interaction.reply({ 
            embeds: [success]})
  
        } else if (game == "rss") {
          
          const checkDB = await db.guilds.findFirst({
            where: {
              rssChannelId: channel.id
            }
          })
  
          if(checkDB) {
            await interaction.reply({ 
              embeds: [alreadyregistered]})
          }
  
          const newChannelDB = await db.guilds.update({
            where: {
              guildId: guildId
            },
            data: {
              rssChannelId: channel.id
            }
          })
  
          await interaction.reply({ 
            embeds: [success]})
  
        } else if (game == "lol") {
            
          const checkDB = await db.guilds.findFirst({
            where: {
              lolChannelId: channel.id
            }
          })
  
          if(checkDB) {
            await interaction.reply({ 
              embeds: [alreadyregistered]})
          }
  
          const newChannelDB = await db.guilds.update({
            where: {
              guildId: guildId
            },
            data: {
              lolChannelId: channel.id
            }
          })
  
          await interaction.reply({ 
            embeds: [success]})
  
        } else if (game == "rl") {
          
          const checkDB = await db.guilds.findFirst({
            where: {
              rlChannelId: channel.id
            }
          })
  
          if(checkDB) {
            await interaction.reply({ 
              embeds: [alreadyregistered]})
          }
  
          const newChannelDB = await db.guilds.update({
            where: {
              guildId: guildId
            },
            data: {
              rlChannelId: channel.id
            }
          })
  
          await interaction.reply({ 
            embeds: [success]})
  
        } else if (game == "cs2") {
          
          const checkDB = await db.guilds.findFirst({
            where: {
              cs2ChannelId: channel.id
            }
          })
  
          if(checkDB) {
            await interaction.reply({ 
              embeds: [alreadyregistered]})
          }
  
          const newChannelDB = await db.guilds.update({
            where: {
              guildId: guildId
            },
            data: {
              cs2ChannelId: channel.id
            }
          })
  
          await interaction.reply({ 
            embeds: [success]})
  
        } else if (game == "rssc") {
          
          const checkDB = await db.guilds.findFirst({
            where: {
              rsscChannelId: channel.id
            }
          })
  
          if(checkDB) {
            await interaction.reply({ 
              embeds: [alreadyregistered]})
          }
  
          const newChannelDB = await db.guilds.update({
            where: {
              guildId: guildId
            },
            data: {
              rsscChannelId: channel.id
            }
          })
  
          await interaction.reply({ 
            embeds: [success]})
  
        } 
      } else {
        await interaction.reply("Please run `/register-server` first.")
      }
    } catch (err) {
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
    ),
};
