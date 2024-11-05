// @ts-check

/**
 * @type {import('robo.js').Config}
 **/
export default {
	clientOptions: {
		intents: ['Guilds', 'GuildMessages']
	},
	plugins: [],
	type: 'robo',
	experimental: {
		buildDirectory: 'dist',
		incrementalBuilds: true,
		shard: true,
		userInstall: true
	}
}
