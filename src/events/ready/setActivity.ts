import { ActivityType, Client } from 'discord.js'

export default async (client: Client) => {
	client.user?.setActivity({
		name: '🔍 Searching Scrims',
		type: ActivityType.Custom
	})
}
