const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = async (guild, client) => {
    const user = await client.users.fetch('516206348568887316');
    const owner = await guild.fetchOwner();
    let serverInfo = `Server Name: ${guild.name}\nServer ID: ${guild.id}\nMember Count: ${guild.memberCount}\nOwner: ${owner.user.tag}\nOwner ID: <@${owner.id}>\nCreated At: ${guild.createdAt}\nRegion: ${guild.region}`;    

    const embed = new EmbedBuilder()
        .setTitle(`Joined a new Server! ${guild.name}`)
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