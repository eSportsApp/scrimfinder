const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { db } = require("../../lib/db");
module.exports = {
    run: async ({ interaction }) => {
      let userInDB = await db.users.findFirst({
        where: {
          userId: interaction.user.id,
        },
      });
      
      let rank;
      let username;
      let userId;
      
      if (!userInDB) {
        userInDB = await db.users.create({
          data: {
            userId: interaction.user.id,
            username: interaction.user.username,
            rssclass: "I",
          },
        });
        rank = "I";
        username = interaction.user.username;
      }
      if (userInDB){
        rank = userInDB.rssclass;
        username = userInDB.username;
        userId = userInDB.userId;
      }
      
      userInDB = await db.users.findUnique({
        where: {
          userId: interaction.user.id,
        },
        include: {
          messages: true,
        },
      });

      const profile = new EmbedBuilder()
      .setTitle("User Profile of " + interaction.user.username)
      .setURL("https://scrimfinder.gg/")
      .setDescription(`**Username:** ${username}\n**User ID:** ${userId}\n**Class:** ${rank}`)
      .setColor("#ff7700")
      .setThumbnail(interaction.user.avatarURL())

    
    // Add active searches to the embed
    if (userInDB && userInDB.messages) {
      if (userInDB.messages.length === 0) {
        profile.addFields({ name: 'Active Searches', value: 'No active searches' });
      } else {
        for (const message of userInDB.messages) {
          profile.addFields({ name: `Search #${userInDB.messages.indexOf(message) + 1}`, value: message.content });
        }
      }
    }


    const deleteButton = new ButtonBuilder()
    .setCustomId('delete_scrims')
    .setLabel('Delete All Scrims')
    .setStyle(ButtonStyle.Danger);

  // Create an action row
  const row = new ActionRowBuilder()
    .addComponents(deleteButton);

  await interaction.reply({
    embeds: [profile]
  , ephermal: true});

  
    },
    data: new SlashCommandBuilder()
    .setName("myprofile")
    .setDescription("Shows your profile, like your class and more in some comming updates"),
    integration_types: [
      1, // USER
      0, // GUILD
    ],
    contexts: [
      0, // GUILD
      1, // BOT_DM
      2, // PRIVATE_CHANNEL
    ],
    
};
//Action row does not work