const{ SlashCommandBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require('discord.js');

module.exports = {

    run: async ({ interaction }) => {
      const embed = new EmbedBuilder()
      .setAuthor({name: "Scrimfinder"})
      .setTitle("Invite Scrimfinder to your Server")
      .setURL("https://scrimfinder.de/")
      .addFields(
        {
          name: "Hey do you like the scrimfinder bot?",
          value: "then why not invite him to your server",
          inline: true
        },
      )
      .setColor("#ff7700")
      .setTimestamp()
      .setFooter({
        text: "Find more information on our website!",
        iconURL: "https://maierfabian.de/images/lovepingu.png",
      })
      

  const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
          .setURL('https://docs.scrimfinder.de/invite')
          .setLabel('Invite Me')
          .setStyle(ButtonStyle.Link),
       
    new ButtonBuilder()
          .setURL('https://scrimfinder.de/')
          .setLabel('My Website')
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