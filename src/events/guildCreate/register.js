module.exports =  async (guild) => {
    const { db } = require("../../lib/db");
const { EmbedBuilder } = require('discord.js');
    const guildDB = await db.guilds.findFirst({
        where: {
            guildId: guild.id
        }
    })
    if(guildDB) {
        return;
    }else {
        const blGuilds = await db.blGuilds.findFirst({
            where: {
                guildId: guild.id
            }
        })
        if(blGuilds) {
            return guild.leave();
        }else {
    const newDBGuild = await db.guilds.create({
        data: {
            guildId: guild.id,
        }

    })
    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
  .setTitle("Hey there!")
  .setURL("https://scrimfinder.gg")
  .setDescription("Thanks for adding me to your server! \nI autoregisterd your guild so you don't have to use the /register command.\nIf you need help, visit our [docs](https://docs.scrimfinder.de) or join our [Support Server](https://discord.gg/division-league-833783529506078781)")
  .setThumbnail("https://maierfabian.de/images/hipingu.png")
  .setColor("#ff7700")
  .setFooter({
    text: "Scrimfinder.gg | Finding Scrims was never that easy!",
    iconURL: "https://maierfabian.de/images/lovepingu.png",
  })
  .setTimestamp();
    owner.send({embeds: [embed]});
    
}}
}