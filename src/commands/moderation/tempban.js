const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { db } = require("../../lib/db");
const { ms } = require("ms");

module.exports = {
  botOwnerOnly: true,
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
      console.log(`🚫 User ${userId} got banned! Reason: ${reason}`)
      // If user is not already banned, create a new bannedUser in the DB.
      const newBannedUser = await db.bannedUsers.create({
        data: {
          userId: userId,
          reason: reason,
        },
        
      });


//time to unban the user
const bantime = 0;
if (!time) {
} else if (time === "1"){
  bantime = 1000; // 24 hours in milliseconds
  //return bantime;
} else if (time === "3"){
  bantime = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
  //return bantime;
} else if (time === "7"){
  bantime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  //return bantime;
} else if (time === "30"){
  bantime = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  //return bantime;
}



//const duration = ms(bantime);

// Schedule the automatic unban
setTimeout(async () => {
  console.log(`Opend timeoutfunction`)
  try {
    // Find the banned user in the DB
    const bannedUser = await db.bannedUsers.findFirst({
      where: {
        userId: userId,
      },
    });

    // If the user is still banned, remove the ban
    if (bannedUser) {
      console.log(`baned user found in db`),
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
}, bantime);

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
      .addChoices({ name: "1 Day", value: "1" })
      .addChoices({ name: "3 Day", value: "3" })
      .addChoices({ name: "1 Day", value: "7" })
      .addChoices({ name: "1 Day", value: "30" })
        .setRequired(true)
    ),
};
