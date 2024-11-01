import {ButtonStyle, Colors, ComponentType } from 'discord.js'
import { createCommandConfig } from 'robo.js'
import type { CommandOptions, CommandResult } from 'robo.js'
import type { CommandInteraction } from 'discord.js'
import sclient from '../utils/client'

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
		required: false,
	}
]
} as const)

export default (interaction: CommandInteraction, options: CommandOptions<typeof config>) => {
	const game = interaction.options.get('game')?.value as string
	const bestof = interaction.options.get('best-of')?.value as number
	const date = interaction.options.get('date')?.value as string
	const time = interaction.options.get('time')?.value as string
	const extrainfo = interaction.options.get('extra-info')?.value as string
	const opensearch = interaction.options.get('open-search')?.value as boolean


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

		//todo: add a request to check if the user is banned
		 sclient.openSearch(searchmessage)		
		 console.log("searching for scrims");
	}
	return {
		embeds: [
		  {
			color: Colors.Red,
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

