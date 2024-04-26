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

// For each guild, transform rssChannelId into an array and update the record

const guilds = await db.guilds.findMany();

// For each guild, add rssChannelId to rssGtoIid and create or update the record
for (const guild of guilds) {
  if (guild.rssChannelId) {
    let rssChannelId = [guild.rssChannelId];
    let rssGtoIid = guild.rssGtoIid ? [...guild.rssGtoIid, ...rssChannelId] : rssChannelId;

    // Update the guild record
    await db.guilds.update({
      where: { id: guild.id },
      data: { rssGtoIid: rssGtoIid },
    });
  }
}

const guildsEmbed = new EmbedBuilder()
  .setTitle("Guilds")
  .setDescription("A list with all the guilds the bot is on.");
          

          
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
