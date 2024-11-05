import { ButtonStyle, Client, ComponentType, TextChannel } from 'discord.js';
import db from '../utils/db';
import { title } from 'process';

interface CloseRequest {
    type: string;
    guildId: string;
    userid: string;
    SearchId: string;
}

export default async function sendScrimMessage(message: CloseRequest, client: Client) {
    try {
        const msg = await db.message.findUnique({
            where: { muuid: message.SearchId }
        });

        if (!msg) {
            console.error('Message not found');
            return;
        }

        for (let i = 0; i < msg.channelIds.length; i++) {
            const channelId = msg.channelIds[i];
            const guildId = msg.guildIds[i];

            if (guildId !== message.guildId) continue;

            const channel = await client.channels.fetch(channelId) as TextChannel;
            if (!channel) continue;

            for (const messageId of msg.messageIds) {
                try {
                    const discordMessage = await channel.messages.fetch(messageId);
                    if (!discordMessage) continue;

                    const embed = discordMessage.embeds[0];
                    if (!embed) continue;

                    const newEmbed = {
                        color: 16744192,
                        author: {
                            name: `${embed.author?.name} (Closed)`,
                            icon_url: `${embed.author?.iconURL}`,
                            url: `${embed.author?.url}`,
                        },
                        description: `~~${embed.description}~~`,
                        footer: {
                            text: `scrimfinder.gg | ${message.userid}`,
                            icon_url: 'https://maierfabian.de/images/lovepingu.png',    
                        },
                    };

                    await discordMessage.edit({
                        embeds: [newEmbed],
                        components: [{
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.Button,
                                    label: '❌This search is closed use /findscrim to find a new one.',
                                    style: ButtonStyle.Danger,
                                    customId: 'contact', 
                                    disabled: true
                                },
                            ]
                        }],
                    });
                } catch (error: any) {
                    if (error.code === 10008) {
                        continue;
                    }
                    console.error('Error editing message:', error);
                }
            }
        }
    } catch (error) {
        console.error('Error closing scrim search:', error);
    }
}