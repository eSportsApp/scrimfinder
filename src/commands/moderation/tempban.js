const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { db } = require("../../lib/db");
const { ms } = require("ms");
// Calculate the ban duration in milliseconds
module.exports = {
  botOwnerOnly: true,
  run: async ({ interaction }) => {
    // Get options input
    const userId = interaction.options.getString("userid");
    const reason = interaction.options.getString("reason");

    // Try to ban the user from the system, but catch any errors
    try {
      const bannedUser = await db.bannedUsers.findFirst({
        where: {
          userId: userId,
        },
      });

      // Check if user is already banned.
      if (bannedUser) {
        await interaction.reply({
          value: "Hmm. Seems like the user is already banned!",
          ephemeral: true,
        });
      }

      // If user is not already banned, create a new bannedUser in the DB.
      const newBannedUser = await db.bannedUsers.create({
        data: {
          userId: userId,
          reason: reason,
        },
      });
//tim
const time = interaction.options.getString("time");
const duration = ms(time);

// Schedule the automatic unban
setTimeout(async () => {
  try {
    // Find the banned user in the DB
    const bannedUser = await db.bannedUsers.findFirst({
      where: {
        userId: userId,
      },
    });

    // If the user is still banned, remove the ban
    if (bannedUser) {
      await db.bannedUsers.delete({
        where: {
          userId: userId,
        },
      });
    }
  } catch (err) {
    // Console log the error
    console.log(`🛑OOPS, there was an error while removing the ban!🛑\n${err}`);
  }
}, duration);

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
      option.setName("reason").setDescription("Reason of the ban.")
      .setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("time").setDescription("How long should the ban last?")
      .addChoices({ name: "1 Day", value: "1" })
      .addChoices({ name: "3 Days", value: "3" })
      .addChoices({ name: "1 Week", value: "7" })
      .addChoices({ name: "1 Month", value: "30" })
        .setRequired(true)
    ),
};
