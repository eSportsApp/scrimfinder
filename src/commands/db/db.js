const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { db } = require("../../lib/db");

module.exports = {
  run: async ({ interaction }) => {
    // Try to run the command, else deal with the error
    try {
      // Get subcommands
      const group = interaction.options.getSubcommandGroup();
      const cmd = interaction.options.getSubcommand();

      // Check which command is used.
      if (group == "list") {
        if (cmd == "guilds") {
          const guilds = await db.guilds.findMany();

          const guildsEmbed = new EmbedBuilder()
            .setTitle("Guilds")
            .setDescription("A list with all the guilds the bot is on.")
            .addFields(
              {
                name: "__**All guild id's:**__",
                value: `${guilds.map((g) => `\n- ${g.guildId}`)}`,
              },
              {
                name: "__**Invite Links:**__",
                value: `${guilds.map((g) => `\n- ${g.inviteLink}`)}`,
              }
            )
            .setColor("#ff7700");
          await interaction.reply({ embeds: [guildsEmbed], ephemeral: true });
        }
      } else {
        await interaction.reply("Oops! Looks like the command doesn't exist.");
      }
    } catch (err) {
      // If an error occurs => console log the error.
      console.log(`🛑OOPS! An error occured!🛑\n${err}`);
    }
  },
  data: new SlashCommandBuilder()
    .setName("db")
    .setDescription("db")
    .addSubcommandGroup((group) =>
      group
        .setName("list")
        .setDescription("db list")
        .addSubcommand((cmd) =>
          cmd
            .setName("guilds")
            .setDescription("List all guilds the server is/was on.")
        )
    ),
};
