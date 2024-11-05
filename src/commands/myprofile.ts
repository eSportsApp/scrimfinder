import {ButtonStyle, Colors, ComponentType } from 'discord.js'
import { createCommandConfig } from 'robo.js'
import type { CommandOptions, CommandResult } from 'robo.js'
import type { CommandInteraction } from 'discord.js'
import { getUser } from '../utils/requests'
import { title } from 'process'

export const config = createCommandConfig({
	description: 'See your Profile and all open Searches',
} as const)

export default async (interaction: CommandInteraction, options: CommandOptions<typeof config>) => {

    const user = await getUser(interaction.user.id);
    console.log(user);

    const openSearchFields = user.openSearches.map((search: any) => ({
        name: `Search ID: ${search.id}`,
        value: `Game: ${search.game}\nPlatform: ${search.platform}\nRegion: ${search.region}\nBest of: ${search.best_of}\nDate: ${search.date}\nTime: ${search.time}\nExtra Info: ${search.extra_info || 'None'}`,
        inline: false
    }));

    return {
        ephemeral: true,
        embeds: [{
            title: `Hello ${user.username} 👋`,
            url: 'https://scrimfinder.gg',
            description: `Here is not much to see yet, but you can see all your open Searches here. Your current class is: ${user.rssclass}`,
            color: 16744192,
            fields:[
                {
                    name: 'Open Searches',
                    value: user.openSearches.length > 0 ? 'Here are your open searches:' : 'No Open Searches',
                },
                ...openSearchFields
            ],
            footer: {
                text: 'scrimfinder.gg | Finding Scrims was never that easy',
                icon_url: 'https://maierfabian.de/images/lovepingu.png',	
            },
        }],
        components: [{
            type: ComponentType.ActionRow,
            components: [
                {
                    type: ComponentType.Button,
                    label: 'What is getting Build here?',
                    style: ButtonStyle.Primary,
                    customId: 'soon'
                }
            ]
        }]
    }
}