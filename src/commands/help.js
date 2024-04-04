const{ SlashCommandBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require('discord.js');

module.exports = {

    run: async ({ interaction }) => {
        const embed = new EmbedBuilder()
        .setTitle("Scrimfinder Help Menu")
        .setURL("https://scrimfinder.de")
        .setDescription("Hey you have trouble getting started?\nUser /register to register your Guild. \nAfter you successfully registerd use /setup-scrim \nNow you are ready to go!")
        .setColor("#ff7700")
        .setTimestamp();

  const row = new ActionRowBuilder()
  .addComponents(
      new ButtonBuilder()
          .setURL('https://docs.scrimfinder.de')
          .setLabel('Visit the docs')
          .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
          .setURL('https://discord.gg/division-league-833783529506078781')
          .setLabel('Join the Support Server')
          .setStyle(ButtonStyle.Link),
          
          
          )
          await interaction.reply({ 
            embeds: [embed], 
            components: [row] }
          
  )
      },
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get Help getting started with the Bot'),
    

    }
