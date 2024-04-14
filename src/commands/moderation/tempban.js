const { db } = require("../../lib/db");
const ms = require('../../lib/ms');
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
// Bannt den nutzer entbannt ihn jedoch nichtmehr. Error müsste in der Timeout funktion liegen
  staffonly: true,
  run: async ({ interaction }) => {
    // Get options input
    const userId = interaction.options.getString("userid");
    const reason = interaction.options.getString("reason");
    const time = interaction.options.getString("time");

    // Try to ban the user from the system, but catch any errors
    try {
      const bannedUser = await db.bannedUsers.findFirst({
        where: {
          userId: userId,
        },
      });

      // Check if user is already banned.
      if (bannedUser) {
        /*await interaction.reply({
          value: "Hmm. Seems like the user is already banned!",
          ephemeral: true,
        });*/
      }
      console.log(`🚫 User ${userId} got banned! Reason: ${reason}`);
      // If user is not already banned, create a new bannedUser in the DB.
      const newBannedUser = await db.bannedUsers.create({
        data: {
          userId: userId,
          reason: reason,
        },
      });

      
      const duration = ms(time);
      console.log('Start');
      setTimeout(() => {
        console.log('End');
      }, 5000);
      console.log(`Duration: ${duration}`);
      setTimeout(async () => {
        console.log(`Opened timeout function`);
        try {
          // Find the banned user in the DB
          const bannedUser = await db.bannedUsers.findFirst({
            where: {
              userId: userId,
            },
          });

          // If the user is still banned, remove the ban
          if (bannedUser) {
            console.log(`Banned user found in db`);
            await db.bannedUsers.delete({
              where: {
                userId: userId,
                reason: reason,
              },
            });
          }
        } catch (err) {
          // Console log the error
          console.log(`🛑OOPS, there was an error while removing the ban!🛑\n${err}`);
        }
      }, duration);      
      // Wait for the specified ban time
      //await new Promise((resolve) => setTimeout(resolve, bantime));
    

      // Send ban confirmation
      const banEmbed = new EmbedBuilder()
        .setTitle("User banned!")
        .setDescription(`<@${userId}> got banned!`)
        .addFields({ name: "**Reason:**", value: `${reason}` })
        .setColor("Red");
      await interaction.reply({ embeds: [banEmbed], ephemeral: true });
    } catch (err) {
      // Console log the error
      console.log(`🛑OOPS, there was an error!🛑\n${err}`);
    }
  },
  data: new SlashCommandBuilder()
    .setName("tempban")
    .setDescription("Ban a user from the system")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("The user that should be banned")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason of the ban.").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("How long should the ban last?")
        .addChoices({ name: "1 Day", value: "1 Day" })
        .addChoices({ name: "3 Days", value: "3 Days" })
        .addChoices({ name: "7 Days", value: "7 Days" })
        .addChoices({ name: "30 Days", value: "30 Days" })
        .setRequired(true)
    ),
};
