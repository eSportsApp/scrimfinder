import type { Guild } from 'discord.js'
import db from '../../utils/db'
export default async (guild: Guild) => {
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

}
