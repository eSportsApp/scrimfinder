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
    return {
        embeds: [{
            title: `Hello ${user.username} 👋`,
            url: 'https://scrimfinder.gg',
            description: `Here is not much to see yet, but you can see all your open Searches here. Your current class is: ${user.class}`,
            color: 16744192,
            fields:[
                {
                    name: 'Open Searches',
                    value: `${user.openSearches}` || 'No Open Searches',
                },
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