// @ts-check


/**
 * @type {import('robo.js').Config}
 **/
export default {
	clientOptions: {
		intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'GuildMessageReactions', 'DirectMessages', 'DirectMessageReactions', 'MessageContent'],
	},
	plugins: [],
	type: 'robo',
	experimental: {
		userInstall: false,
	},
	invite: {
		autoPermissions: false,
		permissions: ['Administrator'],
		scopes: ['applications.commands']
	}
}
