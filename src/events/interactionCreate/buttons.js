module.exports = async (interaction, client) => {
  const { db } = require("../../lib/db");
  if (!interaction.isButton()) return;

  const userId = interaction.message.embeds[0].footer.text
    .split("|")
    .slice(1)
    .toString()
    .slice(1);
  const userInDB = await db.users.findFirst({
    where: {
      userId: userId,
    },
  });
  if (!userInDB) {
    await interaction.reply({
      content: `The User you are looking for is not in the Database \n\n The user has to interact with the bot first to be in the Database`,
      ephemeral: true,
    });
    return;
  }
  const username = userInDB.username;
  if (interaction.customId == "contact") {
    const interactionUserDB = await db.users.findFirst({
      where: {
        userId: interaction.user.id,
      },
    });
    const Iclass = interactionUserDB.rssclass;
    //mach ich dabeim muss mir überlegen, wie ich das mache
    await interaction.reply({
      content: `__**Contact:**__\n**Ping:** <@${userId}>\n**Username:** ${username}\n**User ID:** ${userId}`,
      ephemeral: true,
    });
  }
};