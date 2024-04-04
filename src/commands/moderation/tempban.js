const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { db } = require("../../lib/db");

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
    .addStringOption((option) =>
      option.setName("time").setDescription("How long should the ban last?")
      .addChoices({ name: "1 Day", value: "1day" })
      .addChoices({ name: "3 Days", value: "3days" })
      .addChoices({ name: "1 Week", value: "1week" })
      .addChoices({ name: "1 Month", value: "1month" })
        .setRequired(true)
    ),
};
