import {ButtonStyle, Colors, ComponentType } from 'discord.js'
import { createCommandConfig } from 'robo.js'
import type { CommandOptions, CommandResult } from 'robo.js'
import type { CommandInteraction } from 'discord.js'
import { get } from 'http'
import { getOpenSearches } from '../utils/requests'
import sclient from '../utils/client'

export const config = createCommandConfig({
	description: 'Close an open Search',
    options: [{
		description: '',
		name: 'searchid',
		type: 'string',
		required: true
	}]
} as const)


export default async (interaction: CommandInteraction, options: CommandOptions<typeof config>) => {
	const searchid = options.searchid


	const closerequest = {
		type: 'closerequest',
    	guildId: interaction.guildId || "unknown",
    	userid: interaction.user.id,
    	SearchId: searchid
	}

	  await sclient.closeSearch(closerequest)	

	return {
		embeds: [
			{
			  color: 16744192,
			  title: "Scrimsearch is getting closed!",
			  url: "https://docs.scrimfinder.gg/",
			  description: "Please check with your profile command if the search got closed. Please not this process can take up to 5 minutes.",
			  footer: {
				  text: 'scrimfinder.gg | Finding Scrims was never that easy',
				  icon_url: 'https://maierfabian.de/images/lovepingu.png',	
			  },
			  timestamp: new Date().toISOString(),
			}
		  ],
		  ephemeral: true,
	}

}