import { type UserContextMenuCommandInteraction, type GuildMember, ComponentType, ButtonStyle } from 'discord.js'
import { CommandOptions, createCommandConfig } from 'robo.js'
import  db  from '../../utils/db'
export const config = createCommandConfig({
	description: 'See your Profile and all open Searches',
} as const)


export default async function (interaction: UserContextMenuCommandInteraction, user: GuildMember, options: CommandOptions<typeof config>) {
	const guildMember = interaction.guild?.members.resolve(user)
	if (!guildMember) return { content: 'This user is not in this server', ephemeral: true }
    if(guildMember.user.bot) return { content: 'This user is a bot', ephemeral: true }
    if(guildMember){
        db.networkusers.findUnique({where: {userId: guildMember.id}}).then((user) => {
            if(user){
                return db.rcsbans.findMany({ where: { userId: user.id } }).then((bans) => {
                    if (bans.length > 0) {
                        const banInfo = bans.map((ban) => `Ban ID: ${ban.id}, Reason: ${ban.reason}`).join('\n');
                        return {
                            content: `Infos about ${user.username}\n\nClass: ${user.rssclass}\n\nTAG: ${
                                user.rssClan ? user.rssClan : 'not indexed'
                            }\n\nBanned: ${user.banned ? 'Yes' : 'No'}\n\nBans:\n${banInfo}`,
                            ephemeral: true,
                        };
                    } else {
                        return {
                            content: `Infos about ${user.username}\n\nClass: ${user.rssclass}\n\nTAG: ${
                                user.rssClan ? user.rssClan : 'not indexed'
                            }\n\nBanned: ${user.banned ? 'Yes' : 'No'}\n\nNo bans found.`,
                            ephemeral: true,
                        };
                    }
                });
                }
            else {
                return {
                    content: 'You are not in the network yet. Please join the network first',
                    ephemeral: true
                }
            }
        })
    }
}