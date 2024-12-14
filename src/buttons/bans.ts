import type { ChatInputCommandInteraction } from 'discord.js'

let banned: boolean;
export const customID = 'bans'

export default async (interaction: ChatInputCommandInteraction) => {
	
        
        await interaction.reply({
            content: `We are working on syncing your Scrimfinder Account to your eSportsApp Account. Whats eSportsApp? Stay tuned!`,
            ephemeral: true
        });

}