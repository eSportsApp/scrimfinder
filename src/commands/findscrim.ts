import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { createCommandConfig } from 'robo.js'
import type { CommandOptions, CommandResult } from 'robo.js'
import type { CommandInteraction } from 'discord.js'
import sclient from '../utils/client'
import { searchResult } from '../events/ready/messageHandler'

export const config = createCommandConfig({//bestof, date, time, extrainfo, opensearch
	description: 'find a scrim without any hassle',
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

export default async (interaction: CommandInteraction, options: CommandOptions<typeof config>): Promise<CommandResult> => {
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
		  userid: interaction.user.id,
		  username: interaction.user.username,
		  best_of: bestof,
		  date: date,
		  time: time, 
		}

		//todo: add a request to check if the user is banned
		sclient.openSearch(searchmessage)

		const send = new EmbedBuilder()
        .setTitle("Scrimsearch started!")
        .setURL("https://docs.scrimfinder/invite")
        .setDescription(
          "Have fun and make sure that your DM's are open.\nIf you haven't already consider to invite me to your Server!"
        )
        .setColor("#ff7700")
        .setFooter({
          text: "scrimfinder.gg | Finding Scrims was never that easy",
          iconURL: "https://maierfabian.de/images/lovepingu.png",
        })
        .setTimestamp();

		await interaction.reply(
		 {embeds: [send], ephemeral: true,}
		)
	}
}

