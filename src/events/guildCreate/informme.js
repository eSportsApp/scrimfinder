const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = async (guild, client) => {
    const user = await client.users.fetch('516206348568887316');
    let serverInfo = `Server Name: ${guild.name}\nServer ID: ${guild.id}\nMember Count: ${guild.memberCount}`;
    

    const embed = new EmbedBuilder()
        .setTitle('Server Information')
        .setThumbnail(guild.iconURL())
        .setDescription(serverInfo)
        .setColor('#ff7700')
        .setFooter({
            text: 'Joined a new Server!',
            iconURL: 'https://maierfabian.de/images/lovepingu.png',
        })
        .setTimestamp();

    setTimeout(() => {}, 1000);
    user.send({ embeds: [embed] });
};