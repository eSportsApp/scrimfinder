const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
module.exports = async (guild, client) => {
    const channelId = '1241479324868284476'; // Replace with your channel ID
    const channel = await client.channels.fetch(channelId);
    let serverInfo = `Server Name: ${guild.name}\nServer ID: ${guild.id}\nCreated At: ${guild.createdAt}\nRegion: ${guild.region}`;    

    const embed = new EmbedBuilder()
        .setTitle(`Left a Server! ${guild.name}`)
        .setThumbnail(guild.iconURL())
        .setDescription(serverInfo)
        .setColor('#ff0000')
        .setFooter({
            text: 'Left a Server!',
            iconURL: 'https://maierfabian.de/images/lovepingu.png',
        })
        .setTimestamp();

    setTimeout(() => {}, 1000);
    channel.send({ embeds: [embed] });
}