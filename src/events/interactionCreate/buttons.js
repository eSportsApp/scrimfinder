module.exports = async (interaction, client) => {

    if(!interaction.isButton()) return;

    const userId = interaction.message.embeds[0].footer.text.split("|").slice(1).toString().slice(1)

  const user = client.users.cache.find(u => u.id === userId);
const username = user ? user.username : 'Unknown user';

if(interaction.customId == 'contact') {
    await interaction.reply({ content: `__**Contact:**__\n**Ping:** <@${userId}>\n**Username:** ${username}\n**User ID:** ${userId}`, ephemeral: true })
}

    

}