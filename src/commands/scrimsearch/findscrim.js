const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { db } = require("../../lib/db");
const Twit = require('twit');

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
    const rank = interaction.options.getString("class");
    const date = interaction.options.getString("date");
    const time = interaction.options.getString("time");
    const bestof = interaction.options.getString("best-of");
    const teamname = interaction.options.getString("team-name");
    const type = interaction.options.getString("six_plus_six");
    let extrainfo = interaction.options.getString("extra-info");

  
// Initialize Twitter client
const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});


console.log(game, rank, date, time, bestof, teamname, extrainfo);

const send = new EmbedBuilder()
  .setTitle("Scrimsearch started!")
  .setURL("https://docs.scrimfinder/invite")
  .setDescription("Have fun and make sure that your DM's are open.\nIf you haven't already consider to invite me to your Server!")
  .setColor("#ff7700")
  .setFooter({
    text: "Scrimfinder.de | Finding Scrims was never that easy",
    iconURL: "https://maierfabian.de/images/lovepingu.png",
  })
  .setTimestamp();
  const invitebtn = new ButtonBuilder().setLabel(`Invite Me`).setStyle(ButtonStyle.Link).setURL('https://docs.scrimfinder.de/invite').setEmoji('1173655743606567035');
  const inv = new ActionRowBuilder().addComponents(invitebtn)



    //mainfunction
    if (extrainfo == null) {
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
              rssChannelId: {
                not: null,
              },
            },
          });
  
          if (!channels) return;
  
          const channel = channels.map((c) => c.rssChannelId);
  //scrimsearchEmbed
  const scrimsearchEmbed = new EmbedBuilder()
  .setAuthor({
    name: `${interaction.user.displayName} ${teamname} is LFS`,
    iconURL: `http://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`,
    url: `https://scrimfinder.de`, //eventually trying to add a direct link to the user profile in the future.
    
  })
  .setDescription(`📅 **${date} ${time} **    🎮 **Class ${rank}**    🏆 **Bo${bestof}**`)
  
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
          
          
          /* Tweet the scrim
          const tweetContent = `📅 ${date} ${time} CET 🎮 ${rank} 🏆 Bo${bestof} \n\nExtra Informations: ${extrainfo} \n\n🎮 ${game} \n\n🔗 https://scrimfinder	.de`;
          await T.post('statuses/update', { status: tweetContent });
          console.log(`Tweeted: ${tweetContent}`);
          */
        } else {
          await interaction.reply({content: "Hmm. Seems like the selected game doesn't exit.", ephemeral: true})
        }
  
        await interaction.reply({
          embeds: [send], components: [inv],
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
            rssChannelId: {
              not: null,
            },
          },
        });

        if (!channels) return;

        const channel = channels.map((c) => c.rssChannelId);

        const scrimsearchEmbed = new EmbedBuilder()
  .setAuthor({
    name: `${interaction.user.displayName} ${teamname} is LFS`,
    iconURL: `http://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`,
    url: `https://scrimfinder.de`, //eventually trying to add a direct link to the user profile in the future.
  })
  .setDescription(`📅 **${date} ${time} **    🎮 **Class ${rank}**    🏆 **Bo${bestof}**`)
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
        embeds: [send], components: [inv],
        ephemeral: true
      });
    } catch (err) {
      console.log(err);
    }}
  },
  data: new SlashCommandBuilder()
  .setName("findscrim")
  .setDescription("Find a scrim.")
  .addStringOption((option) =>
    option
      .setName("game")
      .setDescription("The game you want to find a scrim for.")
      .addChoices({ name: "Rainbow Six Siege", value: "rss" })
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("class")
      .setDescription("Class, the class range you are LFS for")
      .addChoices({ name: "Class I", value: "I" },
      { name: "Class H", value: "H" },
      { name: "Class G", value: "G" })
      .setRequired(true))
  
  .addStringOption((option) =>
    option
      .setName("team-name")
      .setDescription("The name of your team.")
      .setRequired(true))
  .addStringOption(option =>
    option
      .setName("best-of")
      .setDescription("Best of.")
      .setRequired(true))
  .addStringOption(option =>
    option
      .setName("date")
      .setDescription("The date you want to find a scrim for.")
      .setRequired(true))
  .addStringOption(option =>
    option
      .setName("time")
        .setDescription("The time you want to scrim.")
        .setRequired(true))
  .addStringOption(option =>
    option
      .setName("extra-info")
      .setDescription("Extra information about the scrim."))
};
