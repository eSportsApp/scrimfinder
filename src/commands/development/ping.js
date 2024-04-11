const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    botOwnerOnly: true,
    run: async ({ interaction, client }) => {

        // Basic ping command to check the bot's response time.
        await interaction.reply({content: `Pong! ${client.ws.ping}ms`, ephemeral: true})

    },
    data: new SlashCommandBuilder().setName('ping').setDescription('Ping Pong!').setDMPermission(false)
}