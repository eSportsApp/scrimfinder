const{ SlashCommandBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require('discord.js');

module.exports = {

    run: async ({ interaction }) => {
      const embed = new EmbedBuilder()
      .setTitle("What are classes?")
      .setURL("https://docs.scrimfinder.de/guides/whatareclasses")
      .setDescription("Classes are a way to categorize players based on their skill level. This makes it easier to find players with a similar skill level to play with. \n\n Your class is managed by the [Rainbow Six Siege Class System](https://discord.gg/fVGMy6ekfk). To get you class changed please go there.")
      .addFields({
        name: "Class I",
        value: "New Teams (people who read the rules and need to be classed further) / Minimum level / Starter League's / First comp. steps"
      })
      .addFields({
        name: "Class H",
        value: "1st Competition Class Teams competing in respectable tournaments"
      })
      .addFields({
        name: "Class G",
        value: "2nd Competition Class Teams outside the top in a tournament with a respectable prize pool and good level of teams"
      })
      .setColor("#ff7700")
      .setFooter({
        text: "Please note, that providing the wrong class can lead to a ban! | Scrimfinder (scrimfinder.gg)",
        iconURL: "https://maierfabian.de/images/lovepingu.png",
      })
      

  const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
          .setURL('https://docs.scrimfinder.de/guides/whatareclasses')
          .setLabel('More about Classes')
          .setStyle(ButtonStyle.Link),
       
    new ButtonBuilder()
          .setURL('https://docs.scrimfinder.de/rcs')
          .setLabel('Class System')
          .setStyle(ButtonStyle.Link),
          
          
          )
          await interaction.reply({ 
            embeds: [embed], 
            components: [row] }
          
  )
      },
    data: new SlashCommandBuilder()
        .setName('whatareclasses')
        .setDescription('What are classes and how do they work?'),
        integration_types: [
          1, // USER
          0, // GUILD
      ]

    }