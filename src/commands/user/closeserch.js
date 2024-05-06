const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, } = require("discord.js");
const { db } = require("../../lib/db");

module.exports = {
    run: async ({ interaction, client }) => {
        let userInDB = await db.users.findUnique({
            where: {
                userId: interaction.user.id,
            },
            include: {
                messages: true,
            },
        });

        const searchId = interaction.options.getString('search');

        if (!userInDB || !userInDB.messages || userInDB.messages.length === 0) {
            await interaction.reply({content:'No active searches', ephemeral: true});
        } else {
            const searchIndex = parseInt(searchId) - 1;

            if (searchIndex < 0 || searchIndex >= userInDB.messages.length) {
                await interaction.reply({content: 'No search found with the given ID', ephemeral: true});
            } else {
                const searchMessage = userInDB.messages[searchIndex];

                // Reply to the interaction immediately with a loading message
const reply = await interaction.reply({content: 'Closing search...',  fetchReply: true , ephemeral: true});

// Edit every message in the chosen message
for (let i = 0; i < searchMessage.messageIds.length; i++) {
    // Fetch the guild, channel, and message from Discord
    const guildId = searchMessage.guildIds[i];
    const channelId = searchMessage.channelIds[i];
    console.log(`Fetching channel ${channelId} from guild ${guildId}`);
    const guild = await client.guilds.fetch(guildId);
    if (!guild) {
        console.error(`Guild ${guildId} not found`);
        continue;
    }
    const channel = await client.channels.fetch(channelId);
    if (!channel) {
        console.error(`Channel ${channelId} not found`);
        continue;
    }
    let discordMessage;
try {
    discordMessage = await channel.messages.fetch(searchMessage.messageIds[i]);
} catch (error) {
    console.error(`Message ${searchMessage.messageIds[i]} not found`);
    continue;
}
    // Edit the message in Discord
    const embed = new EmbedBuilder()
    .setAuthor({
        name: `${interaction.user.displayName} is LFS`,
        iconURL: `http://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`,
        url: `https://discordapp.com/users/${interaction.user.id}/`,
      })
      .setDescription(
        `~~${searchMessage.content}~~`
      )
      .setColor("#ff7700")
      .setFooter({
        text: `scrimfinder.gg  | ${interaction.user.id}`,
        iconURL: "https://maierfabian.de/images/happypingu.png",
      })
      .setTimestamp();
      const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('findscrim')
                .setLabel('This search is closed use /findscrim to find a new one.')
                .setStyle('Danger')
                .setDisabled(true),
        );
    await discordMessage.edit({ embeds: [embed] , components: [row] });
}

// Update the message in the database
await db.message.delete({
    where: {
        id: searchMessage.id,
    },
});
// Edit the reply to the interaction
await interaction.editReply({content: 'Search closed', ephemeral: true});
setTimeout(async () => {
    try {
        // Fetch the message that was replied to
        const message = await interaction.fetchReply();
        // Delete the message
        await message.delete();
    } catch (error) {
        console.error(`Failed to delete message: ${error}`);
    }
}, 60000);
            }
        }
    },
    data: new SlashCommandBuilder()
        .setName("closesearch")
        .setDescription("Close a Search you have made.")
        .addStringOption((option) =>
            option
                .setName("search")
                .setDescription(
                    "The id of the Search you want to close. (Can be found using /myprofile)"
                )
                .setRequired(true)
        ),
};