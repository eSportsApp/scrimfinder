import {ButtonStyle, Colors, ComponentType } from 'discord.js'
import { createCommandConfig } from 'robo.js'
import type { CommandOptions, CommandResult } from 'robo.js'
import type { CommandInteraction } from 'discord.js'

export const config = createCommandConfig({
	description: 'Invite me to your server',
} as const)

export default async (interaction: CommandInteraction, options: CommandOptions<typeof config>) => {
    return {
        embeds: [{
            title: 'Invite Scrimfinder to your Server',
            url: 'https://scrimfinder.gg',
            description: 'Hey do you like the scrimfinder bot? \n then why not invite him to your server',
            color: 16744192
        ,
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
            }
        ]
    }
        
    ]
    }
}