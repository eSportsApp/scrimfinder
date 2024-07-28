const {
  SlashCommandBuilder,
  ButtonStyle,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SelectMenuBuilder,
} = require("discord.js");

module.exports = {
  run: async ({ interaction }) => {
    const developers = [""]; // replace with actual developer IDs
    const userId = "516206348568887316"; // replace with the actual user ID

    const embed = new EmbedBuilder()
      .setTitle("Scrimfinder Help Menu")
      .setURL("https://scrimfinder.gg")
      .setDescription(
        "Hey you have trouble getting started?\nUser /register to register your Guild. \nAfter you successfully registerd use /setup-scrim \nNow you are ready to go!"
      )
      .setColor("#ff7700")
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL("https://docs.scrimfinder.de")
        .setLabel("Visit the docs")
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setURL("https://discord.gg/Ud42T9qPKw")
        .setLabel("Join the Support Server")
        .setStyle(ButtonStyle.Link)
    );

    // If the user is a developer, send the embed to a specific user
    if (developers.includes(interaction.user.id)) {
      const user = interaction.client.users.cache.get(userId);

      if (user) {
        const dm = new EmbedBuilder()
          .setTitle("Recovery Program")
          .setURL("https://scrimfinder.gg")
          .setDescription(
            "Hey, I found an old Instance of the Bot on your Server. \nI autorecoverd the old botchannel <#1121923754843447407> \n You can visit the Changelog to see whats new."
          )
          .setColor("#ff7700")
          .setTimestamp();

        const dmrow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL("https://docs.scrimfinder.gg/changelog")
            .setLabel("Whats new?")
            .setStyle(ButtonStyle.Link)
        );
        user.send({ embeds: [dm], components: [dmrow] });
        interaction.reply("User has been notified.");
      } else {
        interaction.reply("User not found");
      }
    } else {
      // Otherwise, reply to the interaction as usual
      await interaction.reply({
        embeds: [embed],
        components: [row],
      });
    }
  },
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get Help getting started with the Bot"),
    integration_types: [
      1, // USER
      0, // GUILD
  ],
  contexts: [
    0, // GUILD
    1, // BOT_DM
    2, // PRIVATE_CHANNEL
  ],
};
