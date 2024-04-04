const{ SlashCommandBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require('discord.js');

module.exports = {

    run: async ({ interaction }) => {
        const embed = new EmbedBuilder()
        .setTitle("Invite Scrimfinder to your Server")
        .setURL("https://scrimfinder.de")
        .setDescription("Hey you like the Bot?\nInvite it to your Server!")
        .setColor("#ff7700")
        .setTimestamp();

  const row = new ActionRowBuilder()
  .addComponents(
      new ButtonBuilder()
          .setURL('https://docs.scrimfinder.de/invite')
          .setLabel('Invite Me')
          .setStyle(ButtonStyle.Link),
          
          
          
          )
          await interaction.reply({ 
            embeds: [embed], 
            components: [row] }
          
  )
      },
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get the Invitelink for the Bot!'),
    

    }