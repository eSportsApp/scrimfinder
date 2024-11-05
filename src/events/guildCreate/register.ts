import type { Guild } from 'discord.js'
import db from '../../utils/db'

export default async(guild: Guild) => {
    const guildDB = await db.guilds.findFirst({ where: { guildId: guild.id } });
    if (!guildDB) {
        const blGuilds = await db.blGuilds.findFirst({
          where: { guildId: guild.id },
    });
    if (!blGuilds) {
        await db.guilds.create({ data: { guildId: guild.id } });
  
        const owner = await guild.fetchOwner();
        
  
        try {
          await owner.send({ embeds: [{
            title: '❤️ Hey, thanks for adding me to your server!',
            description: `If you need help or have any questions, feel free to join our [support server](https://discord.gg/eSJufJn9DB) or visit our [website](https://scrimfinder.gg).`,
            color: 16744192,
            timestamp: new Date().toISOString(),
            footer: {
              text: 'ScrimFinder.gg',
              icon_url: 'https://maierfabian.de/images/lovepingu.png',
            },
          }] });
        } catch (err) {
          console.log(
            `Failed to send DM to owner: ${owner.id}. Error: ${(err as Error).message}`
          );
        }
      } else {
        guild.leave();
      }
    }
}
