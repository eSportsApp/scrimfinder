module.exports = async (guild) => {
    const { db } = require("../../lib/db");
    const { EmbedBuilder } = require("discord.js");
    const guildDB = await db.guilds.findFirst({ where: { guildId: guild.id } });
  
    if (guildDB) {
        // Delete the guild from the database
        await db.guilds.delete({ where: { guildId: guild.id } });

        const owner = await guild.fetchOwner();
        const embed = new EmbedBuilder()
            .setTitle("It was cool Searching Scrims with u!")
            .setURL("https://scrimfinder.gg")
            .setDescription(
                "It's sad to see you go! \n If there are any features missing or you have feedback please let us know in our [Support Server](https://discord.gg/Uxz7bJtgqG).\n You can reinvite me at anytime [here](https://scrimfinder.gg)"
            )
            .setThumbnail("https://maierfabian.de/images/lovepingu.png")
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
        console.log(`Guild not found in the database: ${guild.id}`);
    }
};