const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    botOwnerOnly: true,
    data: new SlashCommandBuilder()
    .setName('devtools')
    .setDescription('Displays the dev tools for the bot'),
    run: async ({interaction, client}) => {

        const i = interaction;

       
        
        let totalSecs = (client.uptime / 1000);
        let days = Math.floor(totalSecs / 86400);totalSecs %= 86400;
        let hrs = Math.floor(totalSecs / 3600);totalSecs %= 3600;
        let mins = Math.floor(totalSecs / 60);
        let seconds = Math.floor(totalSecs % 60);
        let uptime = `**${days}**d **${hrs}**h **${mins}**m **${seconds}**s`;


        const infoEmbed = new EmbedBuilder()
        .setColor("#ff7700")
        .setTitle('> Scrimfinder Devtools')
        .setURL('https://scrimfinder.de')
        .setFooter({ text: `Scrimfinder devtools.`, 
        iconURL: `https://maierfabian.de/images/lovepingu.png`})
        .setThumbnail('https://maierfabian.de/images/lovepingu.png')
        .setTimestamp()
        .addFields({ name: `**🛠️ STATS**`, value: `Bots current stats`, inline: false})
        .addFields({ name: `Server Count: `, value: `> **${client.guilds.cache.size}**`, inline: true})
        .addFields({ name: `Member Count: `, value: `> **${client.guilds.cache.reduce((a,b) => a+b.memberCount, 0)}**`, inline: true})
        .addFields({ name: `Latency: `, value: `> **${Math.round(client.ws.ping)}ms**`, inline: true})
        .addFields({ name: `Uptime`, value: `> ${uptime}`, inline: true })
        await i.reply({ embeds: [infoEmbed]});
        
    }
}