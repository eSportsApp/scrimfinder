import {ButtonStyle, Colors, ComponentType } from 'discord.js'
import { createCommandConfig } from 'robo.js'
import type { CommandOptions, CommandResult } from 'robo.js'
import type { CommandInteraction } from 'discord.js'
import sclient from '../utils/client'
import { isBanned } from '../utils/requests'

export const config = createCommandConfig({//bestof, date, time, extrainfo, opensearch
	description: 'send your scrim request to the network',
	options: [{
		description: '',
		name: 'game',
		choices: [
			{
				name: 'Rainbow Six Siege',
				value: 'rss'
			}
		],
		type: 'string',
		required: true
	},
	{
		description: '',
		name: 'best-of',
		type: 'number',
		required: true
	},
	{
		description: '',
		name: 'date',
		type: 'string',
		required: true
	},
	{
		description: '',
		name: 'time',
		type: 'string',
		required: true
	},
	{
		description: '',
		name: 'extra-info',
		type: 'string',
		required: false
	},
	{
		description: '',
		name: 'open-search',
		type: 'boolean',
	}
]
} as const)

export default async (interaction: CommandInteraction, options: CommandOptions<typeof config>) => {
    const game = options.game
	const bestof = options['best-of']
	const date = options.date
	const time = options.time
	const extrainfo = options['extra-info']
	const opensearch = options['open-search']
	if (game === "rss") {
		const searchmessage = {
		  type: "search",
		  game: "r6",
		  guildId: interaction.guild?.id ,
		  platform: "pc",
		  region: "emea",
		  user:{
			  id: interaction.user.id,
			  displayName: interaction.user.username,
			  avatar: interaction.user.avatar 
		  },
		  best_of: bestof,
		  date: date,
		  time: time, 
		  extrainfo: extrainfo,
		  opensearch: opensearch
		}

		//* Don't remove this code even if you remove it requests of banned users are getting blocked
		const banned = await isBanned(interaction.user.id)
		if(banned) {
			return {
				embeds: [
					{
					  color: 16744192,
					  title: "You are banned!",
					  url: "https://docs.scrimfinder.gg/",
					  description: "You are banned from the network. Please contact the support for more information.",
					  footer: {
						  text: 'scrimfinder.gg | Finding Scrims was never that easy',
						  icon_url: 'https://maierfabian.de/images/lovepingu.png',	
					  },
					  timestamp: new Date().toISOString(),
					}
				  ],
				  ephemeral: true,
				  abort: true
			}
		}
		await sclient.openSearch(searchmessage)		
		
	}
	return {
		embeds: [
		  {
			color: 16744192,
			title: "Scrimsearch started!",
			url: "https://docs.scrimfinder.gg/",
			description: "Have fun and make sure that your DM's are open.\nIf you haven't already consider to invite me to your Server!",
			footer: {
				text: 'scrimfinder.gg | Finding Scrims was never that easy',
				icon_url: 'https://maierfabian.de/images/lovepingu.png',	
			},
			timestamp: new Date().toISOString(),
		  }
		],
		ephemeral: true,
		components: [
			{
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
		],
	  }
}

