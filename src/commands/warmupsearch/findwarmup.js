const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { db } = require("../../lib/db");

module.exports = {
  
  run: async ({ client, interaction }) => {
    //Embeds
//Response for Banned Users
const banned = new EmbedBuilder()
.setTitle("Sry you are banned from the Bot!")
.setURL("https://scrimfinder.de")
.setDescription("It seems like you are banned from the bot. If you think this is a mistake, please contact us.")
.setColor("#ff7700")
.setTimestamp();
    // Get the selected option
    const game = interaction.options.getString("game");
    const time = interaction.options.getString("time");
    const maps = interaction.options.getString("maps");
    let extrainfo = interaction.options.getString("extra-info");

    





    //mainfunction
    if (extrainfo == null) {
      extrainfo = "No extra information provided.";
      try {
        // Check if user is banned
        const userBanned = await db.bannedUsers.findFirst({
          where: {
            userId: interaction.user.id,
          },
        });
  
        if (userBanned) {
          await interaction.reply({embeds: [banned]}.ephemeral = true);
          return;
        } 
  
        const btn = new ButtonBuilder().setLabel("📬Contact📬").setCustomId('contact').setStyle(ButtonStyle.Primary)
        const test = new ButtonBuilder().setLabel("Direkt Message").setStyle(ButtonStyle.Link).setURL(`discord://-/users/${interaction.user.id}`)
        const contactRow = new ActionRowBuilder().addComponents(btn, test)
        
  
        
      if (game == "rss") {
          const channels = await db.guilds.findMany({
            where: {
              warmuprssChannelId: {
                not: null,
              },
            },
          });
  
          if (!channels) return;
  
          const channel = channels.map((c) => c.warmuprssChannelId);
  //scrimsearchEmbed
  const scrimsearchEmbed = new EmbedBuilder()
  .setAuthor({
    name: `${interaction.user.displayName} is LFW`,
    iconURL: `http://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`,
    url: `https://scrimfinder.de`, //eventually trying to add a direct link to the user profile in the future.
  })
  .setDescription(`📅 **${time} CEST 🗺️ Maps ${maps}**`)
  .setColor("#ff7700")
  .setFooter({
    text: `Scrimfinder.de  | ${interaction.user.id}`,
    iconURL: "https://maierfabian.de/images/happypingu.png",
  })
  .setTimestamp();
   
  
          channel.forEach((c) => {
            const channelToSend = client.channels.cache.get(c);
            if (channelToSend) {
              channelToSend.send({ embeds: [scrimsearchEmbed], components: [contactRow] });
            }
          });
          
        } else {
          await interaction.reply({content: "Hmm. Seems like the selected game doesn't exit.", ephemeral: true})
        }
  
        await interaction.reply({
          content: "Scrimsearch started! Have fun and make sure that your DM's are open ;).",
          ephemeral: true
        });
      } catch (err) {
        console.log(err);
      }
    } else {


//Normal Code

    try {
      // Check if user is banned
      const userBanned = await db.bannedUsers.findFirst({
        where: {
          userId: interaction.user.id,
        },
      });

      if (userBanned) {
        await interaction.reply({embeds: [banned]}.ephemeral = true);
        return;
      } 

      const btn = new ButtonBuilder().setLabel("📬Contact📬").setCustomId('contact').setStyle(ButtonStyle.Primary)
      const test = new ButtonBuilder().setLabel("Direkt Message").setStyle(ButtonStyle.Link).setURL(`discord://-/users/${interaction.user.id}`)
      const contactRow = new ActionRowBuilder().addComponents(btn, test)
      

      
      if (game == "rss") {
        const channels = await db.guilds.findMany({
          where: {
            warmuprssChannelId: {
              not: null,
            },
          },
        });

        if (!channels) return;

        const channel = channels.map((c) => c.warmuprssChannelId);

        const scrimsearchEmbed = new EmbedBuilder()
  .setAuthor({
    name: `${interaction.user.displayName} is LFW`,
    iconURL: `http://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`,
    url: `https://scrimfinder.de`, //eventually trying to add a direct link to the user profile in the future.
  })
  .setDescription(`📅 **${time} CEST 🗺️ Maps ${maps}**`)
  .addFields(
          {
            name: "Extra Informations",
            value: `${extrainfo}`,
            inline: false
          },
        )
  .setColor("#ff7700")
  .setFooter({
    text: `Scrimfinder (scrimfinder.de) | ${interaction.user.id}`,
    iconURL: "https://maierfabian.de/images/happypingu.png",
  })
  .setTimestamp();
       

        channel.forEach((c) => {
          const channelToSend = client.channels.cache.get(c);
          if (channelToSend) {
            channelToSend.send({ embeds: [scrimsearchEmbed], components: [contactRow] });
          }
        });
      } else {
        await interaction.reply({content: "Hmm. Seems like the selected game doesn't exit.", ephemeral: true})
      }

      await interaction.reply({
        content: "Scrimsearch started! Have fun and make sure that your DM's are open ;).",
        ephemeral: true
      });
    } catch (err) {
      console.log(err);
    }}
  },
  data: new SlashCommandBuilder()
    .setName("findwarmup")
    .setDescription("Find a Warmup. Every searches are just for this day.")
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("The game you want to find a scrim for.")
        .addChoices({ name: "Rainbow Six Siege", value: "rss" })
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("maps")
        .setDescription("The maps you want to play.")
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName("time")
          .setDescription("The time you want to scrim. (CEST)")
          .setRequired(true))
    .addStringOption(option =>
      option
        .setName("extra-info")
        .setDescription("Extra information if needed "))
        .setDMPermission(false),
};
