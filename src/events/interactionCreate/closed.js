module.exports = async (interaction, client) => {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;
        if (interaction.customId === 'findscrim') {
            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply('Please use the `/findscrim` command to find a scrim.');
        }
    });
}