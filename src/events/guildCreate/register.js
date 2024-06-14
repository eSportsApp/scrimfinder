module.exports = async (guild) => {
  const { db } = require("../../lib/db");
  const { EmbedBuilder } = require("discord.js");
  const guildDB = await db.guilds.findFirst({ where: { guildId: guild.id } });

  if (!guildDB) {
    const blGuilds = await db.blGuilds.findFirst({
      where: { guildId: guild.id },
    });

    if (!blGuilds) {
      await db.guilds.create({ data: { guildId: guild.id } });

      const owner = await guild.fetchOwner();
      const embed = new EmbedBuilder()
        .setTitle("Hey there!")
        .setURL("https://scrimfinder.gg")
        .setDescription(
          "Thanks for adding me to your server! \nI autoregisterd your guild so you don't have to use the /register command.\nIf you need help, visit our [docs](https://docs.scrimfinder.de) or join our [Support Server](https://discord.gg/Ud42T9qPKw)"
        )
        .setThumbnail("https://maierfabian.de/images/hipingu.png")
        .setColor("#ff7700")
        .setFooter({ 
          text: 'Scrimfinder.gg | Finding Scrims was never that easy!', 
          iconURL: 'https://maierfabian.de/images/lovepingu.png' 
      })
        .setTimestamp();

      try {
        await owner.send({ embeds: [embed] });
      } catch (err) {
        console.log(
          `Failed to send DM to owner: ${owner.id}. Error: ${err.message}`
        );
      }
    } else {
      guild.leave();
    }
  }
};
