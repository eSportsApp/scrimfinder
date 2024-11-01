import { ActivityType, Client } from 'discord.js'
import sclient from '../../utils/client'

export default async (client: Client) => {
	client.user?.setActivity({
		name: '🔍 Searching Scrims',
		type: ActivityType.Custom
		// url: 'https://www.twitch.tv/discord'
	})
}
