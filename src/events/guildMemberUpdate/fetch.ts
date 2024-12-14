import type { GuildMember } from 'discord.js';
import db from '../../utils/db';

export default async (oldMember: GuildMember, newMember: GuildMember) => {
    console.log('guildMemberUpdate fetch');
    const guildID = '637333042301632535';
  
    const roleToRssClassMap: { [key: string]: string } = {
      '638375833928466433': 'A',
      '637337720779309056': 'B',
      '638038928837836800': 'C',
      '637338342869958659': 'D',
      '792776430312357958': 'E',
      '719907815434616893': 'F',
      '1066713175795445850': 'G',
      '637972946551570432': 'H',
      '685202104897503240': 'I',
    };
  
    const nickname = newMember.nickname || newMember.user.username; // Use nickname or fallback to username
    const rssClanMatch = nickname.match(/\[(.*?)\]/);
    const rssClan = rssClanMatch ? rssClanMatch[1] : null;
    const mena = nickname.includes('- MENA');
    const probation = nickname.includes('- PROB');
  
    let rssClass = null;
    for (const [roleId, className] of Object.entries(roleToRssClassMap)) {
      if (newMember.roles.cache.has(roleId)) {
        rssClass = className;
        break;
      }
    }
  
    console.log('nickname', nickname, 'rssClan', rssClan, 'mena', mena, 'probation', 'rssClass', rssClass);
  
    const dataToUpsert = {
      userId: newMember.id,
      username: nickname,
      rssClan: rssClan || undefined,
      mena,
      probation,
      rssclass: rssClass,
    };
  
    try {
      await db.networkusers.upsert({
        where: { userId: newMember.id },
        update: dataToUpsert,
        create: dataToUpsert,
      });
      console.log('User data updated successfully.');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };