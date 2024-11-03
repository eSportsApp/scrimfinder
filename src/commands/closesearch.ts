import {ButtonStyle, Colors, ComponentType } from 'discord.js'
import { createCommandConfig } from 'robo.js'
import type { CommandOptions, CommandResult } from 'robo.js'
import type { CommandInteraction } from 'discord.js'
import { get } from 'http'
import { getOpenSearches } from '../utils/requests'

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

}