module.exports =  async (guild) => {
    const { db } = require("../../lib/db");
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
    })}}
}