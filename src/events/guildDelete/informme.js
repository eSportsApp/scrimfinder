const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
module.exports = async (guild, client) => {
    const user = await client.users.fetch('516206348568887316');
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
    user.send({ embeds: [embed] });
}