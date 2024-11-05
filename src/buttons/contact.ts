import type { ChatInputCommandInteraction } from 'discord.js'
import { getUser, isBanned } from '../utils/requests';

let banned: boolean;
export const customID = 'contact'

export default async (interaction: ChatInputCommandInteraction) => {
	if (!(interaction as any).message.embeds[0] || !(interaction as any).message.embeds[0].footer) {
    
        interaction.reply( {
            content: "This message is not a contact message",
            ephemeral: true,
        });
      }
    banned = await isBanned(interaction.user.id);
    if (banned) {
        interaction.reply( {
            content: "You are banned from using this bot.",
            ephemeral: true,
        });
    }
    const userId = (interaction as any).message.embeds[0].footer.text
        .split("|")
        .slice(1)
        .toString()
        .slice(1);

    try {
        const user = await getUser(userId);
        // Process the response data here
        let labels = '';
        if (user.data.labels && user.data.labels.length > 0) {
            labels = `**Labels:** ${user.data.labels.join(', ')}\n`;
        }
        
        await interaction.reply({
            content: `**Contact:**\n**Ping:** <@${userId}>\n**Username:** ${user.data.username}\n**User ID:** ${userId}\n${labels}`,
            ephemeral: true
        });
    } catch (error) {
        console.error('Error making API request:', error);
    }

     

}