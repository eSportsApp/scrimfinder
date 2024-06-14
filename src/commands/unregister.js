const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, PermissionsBitField } = require("discord.js");
const { db } = require("../lib/db");

module.exports = {
    run: async ({ interaction }) => {
  
  
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
  const notfound = new EmbedBuilder()
  .setTitle("Channel is not registered!")
  .setURL("https://scrimfinder.gg")
  .setDescription("This channel seems not to be registered.!\n\n If you need help, visit our [docs](https://docs.scrimfinder.de) or join our [Support Server](https://discord.gg/Ud42T9qPKw)\n\nTo get started just try /findscrim")
  .setColor("#ff7700")
  .setTimestamp();
  
  //Response for successfully registered Servers
  const success = new EmbedBuilder()
  .setTitle("You have successfully unregistered the channel!")
  .setURL("https://scrimfinder.gg")
  .setDescription("You have successfully unregistered the channel for the game.\n\n If you need help, visit our [docs](https://docs.scrimfinder.de) or join our [Support Server](https://discord.gg/Ud42T9qPKw)\n\nTo get started just try /findscrim")
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

      if (game == "rss") {

        const checkDB = await db.guilds.findFirst({
          where: {
            rssChannelId: channel.id
          }
        })

        if(!checkDB) {
          await interaction.reply({ 
            embeds: [notfound]})
        }

        const deleteChannel = await db.guilds.update({
          where: {
            guildId: guildId
          },
          data: {
            rssChannelId: null
          }
        })

        await interaction.reply({ 
          embeds: [success]})

      } else if (game == "warmup") {
        const checkDB = await db.guilds.findFirst({
            where: {
                warmuprssChannelId: channel.id
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
                warmuprssChannelId: null
            }
          })
  
          await interaction.reply({ 
            embeds: [success]})
          }
    } else
 {
    await interaction.reply("You can't unregister a channel that is not registered.")
  }
  } catch (err) {
    console.log(err);
  }
    },
data: new SlashCommandBuilder()
  .setName("unregister")
  .setDescription("unregister a channel for a game.")
  .addStringOption((option) =>
    option
      .setName("game")
      .setDescription(
        "The game you want to unregister the channel for."
      )
      .addChoices({ name: "Rainbow Six Siege", value: "rss" })
        .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("range")
      .setDescription(
        "The range you want to unregister the channel for."
      )
      .addChoices({ name: "G to I", value: "gi" })
      .addChoices({ name: "F to F", value: "df" })
        .setRequired(true)
  )

    .addChannelOption((option) =>
        option
        .setName("channel")
        .setDescription("The channel you want to unregister.")
        .setRequired(true)
    )
    .setDMPermission(false),
    
    
    };
