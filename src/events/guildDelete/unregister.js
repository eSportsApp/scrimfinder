module.exports = async (guild) => {
    const { db } = require("../../lib/db");
    const { EmbedBuilder } = require("discord.js");
    const guildDB = await db.guilds.findFirst({ where: { guildId: guild.id } });
  
    if (guildDB) {
        // Delete the guild from the database
     try{   await db.guilds.delete({ where: { guildId: guild.id } });}
        catch(err){
            console.log(err)
        }
    } else {
        console.log(`Guild not found in the database: ${guild.id}`);
    }
};