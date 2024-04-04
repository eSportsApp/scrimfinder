module.exports = async (interaction, client) => {

    if(!interaction.isButton()) return;

    const userId = interaction.message.embeds[0].footer.text.split("|").slice(1).toString().slice(1)

    if(interaction.customId == 'contact') {
        await interaction.reply({ content: `__**Contact:**__\n**Ping:** <@${userId}>\n**Username:** ${client.users.cache.find(u => u.id === userId).username}\n**User ID:** ${userId}`, ephemeral: true })
    }

    

}