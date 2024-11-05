import {ButtonStyle, Colors, ComponentType } from 'discord.js'
import { createCommandConfig } from 'robo.js'
import type { CommandOptions, CommandResult } from 'robo.js'
import type { CommandInteraction } from 'discord.js'
import { url } from 'inspector'

export const config = createCommandConfig({
	description: 'See all the commands available',
} as const)

export default async (interaction: CommandInteraction, options: CommandOptions<typeof config>) => {
    return {
        embeds: [{
            title: 'Help Menu',
            url: 'https://scrimfinder.gg',
            description: 'The Scrim Network is a place where you can find scrims for your team. You can also post your own scrim requests. It uses the Rainbow Six Class System. Here are the commands available:',
            fields: [
                {
                    name: 'Scrim Commands',
                    value: '/findscrim - send your scrim request to the network'
                },
                {
                    name: 'Utility Commands',
                    value: '/help - see all the commands available\n/setup - set up a channel for scrims\n/invite - invite me to your server'
                }
            ],
            color: 16744192,
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
                    label: 'Invite Me',
                    style: ButtonStyle.Link,
                    url: 'https://docs.scrimfinder.gg/invite'
                },
                {
                    type: ComponentType.Button,
                    label: 'Support Server',
                    style: ButtonStyle.Link,
                    url: 'https://discord.gg/eSJufJn9DB'
                },
                {
                    type: ComponentType.Button,
                    label: 'RCS',
                    style: ButtonStyle.Link,
                    url: 'https://discord.gg/nrbwf929rK'
                }
            ]
        }
            
        ]
    }
}