import { createCommandConfig } from 'robo.js'
import type { CommandOptions, CommandResult } from 'robo.js'
import type { CommandInteraction } from 'discord.js'
import db from '../utils/db'
export const config = createCommandConfig({
	description: 'Admin Command do not use',
} as const)

class UserIndexer {
    private interaction: CommandInteraction;
  
    constructor(interaction: CommandInteraction) {
      this.interaction = interaction;
    }
  
    public async indexUsers() {
      const guild = this.interaction.guild;
      if (this.interaction.user.id !== '516206348568887316') {
        return { content: 'You are not allowed to use this command', ephemeral: true }
      }
      if (!guild) {
        return { content: 'This command can only be used in a server.', ephemeral: true };
      }
      await this.interaction.deferReply({ ephemeral: true });
      try {
        const members = await guild.members.fetch();
        const roleToRssClassMap: { [key: string]: string } = {
            '685202104897503240': 'I',
            '637972946551570432': 'H',
            '1066713175795445850': 'G',
            '719907815434616893': 'F',
            '792776430312357958': 'E',
            '637338342869958659': 'D',
            '638038928837836800': 'C',
            '637337720779309056': 'B',
            '638375833928466433': 'A',
          };
        for (const [userId, member] of members) {
          if (!member) continue; // Ensure the member exists
            
          const username = member.user.username;
          const nickname = member.nickname || member.user.username; // Use nickname or fallback to username
    const rssClanMatch = nickname.match(/\[(.*?)\]/);
    const rssClan = rssClanMatch ? rssClanMatch[1] : null;
    const mena = nickname.includes('- MENA');
    const probation = nickname.includes('- PROB');
    let rssClass = "I";
        for (const [roleId, className] of Object.entries(roleToRssClassMap)) {
          if (member.roles.cache.has(roleId)) {
            rssClass = className;
            break;
          }
        }
  console.log('username', username, 'rssClan', rssClan, 'mena', mena, 'probation', probation);
  const dataToUpsert = {
    userId,
    username: username,
    rssClan: rssClan || undefined,
    mena,
    probation,
    rssclass: rssClass,
  };

  await db.networkusers.upsert({
    where: { userId },
    update: dataToUpsert,
    create: dataToUpsert,
  });
        }
        await this.interaction.editReply({ content: 'Users have been indexed successfully.' });
      } catch (error) {
        console.error('Error fetching members or saving to the database:', error);
        await this.interaction.editReply({ content: 'There was an error indexing the users.' });
      }
    }
  }

export default async (interaction: CommandInteraction) => {
  const userIndexer = new UserIndexer(interaction);
  return await userIndexer.indexUsers();
}