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
      .setURL("https://scrimfinder.de/")
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
    embeds: [profile],
    components: [row]
  });
  interaction.client.on('interactionCreate', async (buttonInteraction) => {
    try {
    if (!buttonInteraction.isButton()) return;
    if (buttonInteraction.customId === 'delete_scrims') {
      if (buttonInteraction.user.id !== interaction.user.id) {
        return buttonInteraction.reply({ content: 'You cannot delete someone else\'s scrims!', ephemeral: true });
      }
  
      // Delete all scrims of the user
      await db.users.update({
        where: {
          userId: interaction.user.id,
        },
        data: {
          messages: {
            deleteMany: {},
          },
        },
      });
  
      await buttonInteraction.reply({ content: 'All your scrims have been deleted!', ephemeral: true });
    }
  } catch (error) {
    console.error(error);
    await buttonInteraction.reply({ content: 'Please run /myprofile again to use this function', ephemeral: true });
  }
  });
  
    },
    data: new SlashCommandBuilder()
    .setName("myprofile")
    .setDescription("Shows your profile, like your class and more in some comming updates"),
};
//Acton row does not work