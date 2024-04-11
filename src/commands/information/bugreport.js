const{ SlashCommandBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require('discord.js');

module.exports = {

    run: async ({ interaction }) => {
        const embed = new EmbedBuilder()
        .setTitle("Submit a Bug to the Admins")
        .setURL("https://scrimfinder.de")
        .setDescription("You found a Bug?\nSubmit it to the Admins!")
        .setColor("#ff7700")
        .setTimestamp();

  const row = new ActionRowBuilder()
  .addComponents(
      new ButtonBuilder()
          .setURL('https://discord.gg/division-league-833783529506078781')
          .setLabel('Report Bug')
          .setStyle(ButtonStyle.Link),
          
          
          
          )
          await interaction.reply({ 
            embeds: [embed], 
            components: [row] }
          
  )
      },
    data: new SlashCommandBuilder()
        .setName('bug-report')
        .setDescription('Report a Bug to the Admins!'),
    

    }