import type { Client, Guild, TextChannel } from 'discord.js';

export default async (guild: Guild, client: Client) => {
console.log(`Guild Joined: ${guild.name} (${guild.id})`);
    /*
    const channelId = '1251564697384255500'; 
    if (!client.channels) {
        console.error('Client channels are undefined');
        return;
    }

    const channel = await client.channels.fetch(channelId) as TextChannel;
    let serverInfo = `Server Name: ${guild.name}\nServer ID: ${guild.id}\nCreated At: ${guild.createdAt}`;

    setTimeout(() => {}, 1000);

    if (channel) {
        channel.send({ embeds: [
            {
                title: 'Guild Joined',
                description: serverInfo,
                color: 16744192,
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'ScrimFinder.gg',
                    icon_url: 'https://maierfabian.de/images/lovepingu.png',
                },
            },
        ] });
    }
        */
}