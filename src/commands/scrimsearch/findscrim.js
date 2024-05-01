const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const { db } = require("../../lib/db");
const Twit = require("twit");

module.exports = {
  run: async ({ client, interaction }) => {
    //Embeds
    //Response for Banned Users
    
    ////////////////////////////////////////////////////////////////////////////////////////
    // Get the selected option
    const game = interaction.options.getString("game");
    const date = interaction.options.getString("date");
    const time = interaction.options.getString("time");
    const bestof = interaction.options.getString('best-of');
    let teamname = interaction.options.getString("team-name");
    let extrainfo = interaction.options.getString("extra-info");
    let shareranges = interaction.options.getString("shareit-everywhere");
    let rank;
    const sentMessageIds = [];
const sentChannelIds = [];
const sentGuildIds = [];
    try {
      maps = parseInt(interaction.options.getString('best-of'));
    }catch (err) {
      console.log(err);
    }
    try {
      // Check if user is banned
      const userBanned = await db.bannedUsers.findFirst({
        where: {
          userId: interaction.user.id,
        },
      });
      

      if (userBanned) {
        if (userBanned.reason == null) {
          userBanned.reason = "No reason provided.";
        }
        const banned = new EmbedBuilder()
      .setTitle("Sry you are banned from the Bot!")
      .setURL("https://scrimfinder.gg")
      .setDescription(
        "It seems like you are banned from the bot. If you think this is a mistake, please contact us."
      )
      .setFields({
        name: "Reason",
        value: userBanned.reason,
        inline: false,
      })
      .setColor("#ff7700")
      .setTimestamp();
        await interaction.reply(({ embeds: [banned], ephemeral: true}));
        return;
      }else {
      // Check if user is in the database
      const userInDB = await db.users.findFirst({
        where: {
          userId: interaction.user.id,
        },
      });
      if (!userInDB) {
        // Create user in the database if not exists
        await db.users.create({
          data: {
            userId: interaction.user.id,
            username: interaction.user.username,
            rssclass: "I",
          },
        });
        rank = "I";
      } else {
        // Get the rank of the user
        rank = userInDB.rssclass;
        if (userInDB.username != interaction.user.username) {
          await db.users.update({
            where: {
              userId: interaction.user.id,
            },
            data: {
              username: interaction.user.username,
            },
          });
        }
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    // Initialize Twitter client
    const T = new Twit({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    /*
    // Check if any word in date, time, or extrainfo is in the badwordsdb
    const badWords = await db.badwords.findMany();
    const dateWords = date.split(" ");
    const timeWords = time.split(" ");
    const extrainfoWords = extrainfo.split(" ");

    const containsBadWord = async (words) => {
      for (const word of words) {
        if (badWords.some((badWord) => word.toLowerCase().includes(badWord.word.toLowerCase()))) {
          return true;
        }
      }
      return false;
    };

    if (containsBadWord(dateWords) || containsBadWord(timeWords) || containsBadWord(extrainfoWords)) {
      await interaction.reply("Your input contains inappropriate words. You have been banned from the bot.");
      const newBannedUser = await db.bannedUsers.create({
        data: {
          userId: interaction.user.id,
          reason: "Inappropriate words in the input.",
        },
      });
      return;
    }*/
    console.log(game, rank, date, time, bestof, teamname, extrainfo);
    if (maps) {
      const stats = await db.datas.findFirst({
        where: {
          name: "stats",
        },
      });
  
      if (stats) {
        await db.datas.update({
          where: {
            name: "stats",
          },
          data: {
            Scrimsserched: stats.Scrimsserched + 1,
            averagemapecount: (stats.allmapecount + maps) / (stats.Scrimsserched),
            allmapecount: stats.allmapecount + maps,
          },
        });
      } else {
        await db.datas.create({
          data: {
            name: "stats",
            Scrimsserched: 1,
            allmapecount: maps,
            averagemapecount: maps,
          },
        })
      }
    }
    

    await interaction.deferReply({ ephemeral: true });

    const send = new EmbedBuilder()
      .setTitle("Scrimsearch started!")
      .setURL("https://docs.scrimfinder/invite")
      .setDescription(
        "Have fun and make sure that your DM's are open.\nIf you haven't already consider to invite me to your Server!"
      )
      .setColor("#ff7700")
      .setFooter({
        text: "scrimfinder.gg | Finding Scrims was never that easy",
        iconURL: "https://maierfabian.de/images/lovepingu.png",
      })
      .setTimestamp();
    const invitebtn = new ButtonBuilder()
      .setLabel(`Invite Me`)
      .setStyle(ButtonStyle.Link)
      .setURL("https://docs.scrimfinder.de/invite")
      .setEmoji("1173655743606567035");
    const inv = new ActionRowBuilder().addComponents(invitebtn);
      if (teamname = null) {
      teamname = ``}
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
          await interaction.reply(({ embeds: [banned] }.ephemeral = true));
          return;
        }
        const userInDB = await db.users.findFirst({
          where: {
            userId: interaction.user.id,
          },
        });
        if (!userInDB) {
          await db.users.create({
            data: {
              userId: interaction.user.id,
              username: interaction.user.username,
              rssclass: "I",
            },
          });
          const rank = "I";
        } else {
          const rank = userInDB.rssclass;
        }

        const btn = new ButtonBuilder()
          .setLabel("📬Contact📬")
          .setCustomId("contact")
          .setStyle(ButtonStyle.Primary);
        const test = new ButtonBuilder()
          .setLabel("Direkt Message")
          .setStyle(ButtonStyle.Link)
          .setURL(`discord://-/users/${interaction.user.id}`);
        const contactRow = new ActionRowBuilder().addComponents(btn, test);

        if (game == "rss") {
          if (rank === "I" || rank === "H" || rank === "G") {
          const guilds = await db.guilds.findMany();
        
          let channels = [];
          guilds.forEach(guild => {
            if (guild.rssGtoIid) {
              channels = [...channels, ...guild.rssGtoIid];
            }
          });
        
          if (!channels.length) return;
        
          const scrimsearchEmbed = new EmbedBuilder()
            .setAuthor({
              name: `${interaction.user.displayName} is LFS`,
              iconURL: `http://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`,
              url: `https://discordapp.com/users/${interaction.user.id}/`,
            })
            .setDescription(
              ` **${date} ${time} **     **Class ${rank}**     **${bestof} Maps**`
            )
            .setColor("#ff7700")
            .setFooter({
              text: `Scrimfinder.gg  | ${interaction.user.id}`,
              iconURL: "https://maierfabian.de/images/happypingu.png",
            })
            .setTimestamp();
        
            for (const c of channels) {
              const channelToSend = client.channels.cache.get(c);
              if (channelToSend) {
                const message = await channelToSend.send({
                  embeds: [scrimsearchEmbed],
                  components: [contactRow],
                });
            
                // Store the sent message ID, channel ID, and guild ID
                sentMessageIds.push(message.id);
                sentChannelIds.push(c);
                sentGuildIds.push(interaction.guild.id);
              }
            }

          /* Tweet the scrim
          const tweetContent = `📅 ${date} ${time} CET 🎮 ${rank} 🏆 Bo${bestof} \n\nExtra Informations: ${extrainfo} \n\n🎮 ${game} \n\n🔗 https://scrimfinder	.de`;
          await T.post('statuses/update', { status: tweetContent });
          console.log(`Tweeted: ${tweetContent}`);
          */
         
          await db.message.create({
            data: {
              content: ` **${date} ${time} **     **Class ${rank}**     **${bestof} Maps**`,
              messageIds: sentMessageIds,
              channelIds: sentChannelIds,
              guildIds: sentGuildIds,
              user: {
                connect: {
                  userId: interaction.user.id,
                },
              },
            },
          });
        await interaction.editReply({
          embeds: [send],
          components: [inv],
          ephemeral: true,
        });
      } else{
        const guilds = await db.guilds.findMany();
        
          let channels = [];
          guilds.forEach(guild => {
            if (guild.rssDtoFid) {
              channels = [...channels, ...guild.rssDtoFid];
            }
          });
        
          if (!channels.length) return;
        
          const scrimsearchEmbed = new EmbedBuilder()
            .setAuthor({
              name: `${interaction.user.displayName} is LFS`,
              iconURL: `http://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`,
              url: `https://discordapp.com/users/${interaction.user.id}/`,
            })
            .setDescription(
              ` **${date} ${time} **     **Class ${rank}**     **${bestof} Maps**`
            )
            .setColor("#ff7700")
            .setFooter({
              text: `Scrimfinder.gg  | ${interaction.user.id}`,
              iconURL: "https://maierfabian.de/images/happypingu.png",
            })
            .setTimestamp();
        
          channels.forEach((c) => {
            const channelToSend = client.channels.cache.get(c);
            if (channelToSend) {
              channelToSend.send({
                embeds: [scrimsearchEmbed],
                components: [contactRow],
              });
            }
          });
          if (shareranges == "yes") {
            const guilds = await db.guilds.findMany();
        
          let channels = [];
          guilds.forEach(guild => {
            if (guild.rssGtoIid) {
              channels = [...channels, ...guild.rssGtoIid];
            }
          });
        
          if (!channels.length) return;
        
          const scrimsearchEmbed = new EmbedBuilder()
            .setAuthor({
              name: `${interaction.user.displayName} is LFS`,
              iconURL: `http://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`,
              url: `https://discordapp.com/users/${interaction.user.id}/`,
            })
            .setDescription(
              ` **${date} ${time} **     **Class ${rank}**     **${bestof} Maps**`
            )
            .setColor("#ff7700")
            .setFooter({
              text: `Scrimfinder.gg  | ${interaction.user.id}`,
              iconURL: "https://maierfabian.de/images/happypingu.png",
            })
            .setTimestamp();
        
            for (const c of channels) {
              const channelToSend = client.channels.cache.get(c);
              if (channelToSend) {
                const message = await channelToSend.send({
                  embeds: [scrimsearchEmbed],
                  components: [contactRow],
                });
            
                // Store the sent message ID, channel ID, and guild ID
                sentMessageIds.push(message.id);
                sentChannelIds.push(c);
                sentGuildIds.push(interaction.guild.id);
              }
            }
          /* Tweet the scrim
          const tweetContent = `📅 ${date} ${time} CET 🎮 ${rank} 🏆 Bo${bestof} \n\nExtra Informations: ${extrainfo} \n\n🎮 ${game} \n\n🔗 https://scrimfinder	.de`;
          await T.post('statuses/update', { status: tweetContent });
          console.log(`Tweeted: ${tweetContent}`);
          */
      

      }
      await db.message.create({
        data: {
          content: ` **${date} ${time} **     **Class ${rank}**     **${bestof} Maps**`,
          messageIds: sentMessageIds,
          channelIds: sentChannelIds,
          guildIds: sentGuildIds,
          user: {
            connect: {
              userId: interaction.user.id,
            },
          },
        },
      });
      await interaction.editReply({
        embeds: [send],
        components: [inv],
        ephemeral: true,
      });
    }}} catch (err) {
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
          await interaction.editReply(({ embeds: [banned] }.ephemeral = true));
          return;
        }
        const userInDB = await db.users.findFirst({
          where: {
            userId: interaction.user.id,
          },
        });
        if (!userInDB) {
          await db.users.create({
            data: {
              userId: interaction.user.id,
              username: interaction.user.username,
              rssclass: "I",
            },
          });
          const rank = "I";
        } else {
          const rank = userInDB.rssclass;
        }

        const btn = new ButtonBuilder()
          .setLabel("📬Contact📬")
          .setCustomId("contact")
          .setStyle(ButtonStyle.Primary);
        const test = new ButtonBuilder()
          .setLabel("Direkt Message")
          .setStyle(ButtonStyle.Link)
          .setURL(`discord://-/users/${interaction.user.id}`);
        const contactRow = new ActionRowBuilder().addComponents(btn, test);

        if (game == "rss") {
          if (rank === "I" || rank === "H" || rank === "G") {
          const guilds = await db.guilds.findMany();
        
          let channels = [];
          guilds.forEach(guild => {
            if (guild.rssGtoIid) {
              channels = [...channels, ...guild.rssGtoIid];
            }
          });
        
          if (!channels.length) return;
        
          const scrimsearchEmbed = new EmbedBuilder()
            .setAuthor({
              name: `${interaction.user.displayName} is LFS`,
              iconURL: `http://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`,
              url: `https://discordapp.com/users/${interaction.user.id}/`, //eventually trying to add a direct link to the user profile in the future.
            })
            .setDescription(
              ` **${date} ${time} **     **Class ${rank}**     **${bestof} Maps**`
            )
            .addFields({
              name: "Extra Informations",
              value: `${extrainfo}`,
              inline: false,
            })
            .setColor("#ff7700")
            .setFooter({
              text: `Scrimfinder (scrimfinder.gg) | ${interaction.user.id}`,
              iconURL: "https://maierfabian.de/images/happypingu.png",
            })
            .setTimestamp();
        
            for (const c of channels) {
              const channelToSend = client.channels.cache.get(c);
              if (channelToSend) {
                const message = await channelToSend.send({
                  embeds: [scrimsearchEmbed],
                  components: [contactRow],
                });
            
                // Store the sent message ID, channel ID, and guild ID
                sentMessageIds.push(message.id);
                sentChannelIds.push(c);
                sentGuildIds.push(interaction.guild.id);
              }
            }

          /* Tweet the scrim
          const tweetContent = `📅 ${date} ${time} CET 🎮 ${rank} 🏆 Bo${bestof} \n\nExtra Informations: ${extrainfo} \n\n🎮 ${game} \n\n🔗 https://scrimfinder	.de`;
          await T.post('statuses/update', { status: tweetContent });
          console.log(`Tweeted: ${tweetContent}`);
          */
         
          await db.message.create({
            data: {
              content: ` **${date} ${time} **     **Class ${rank}**     **${bestof} Maps**`,
              messageIds: sentMessageIds,
              channelIds: sentChannelIds,
              guildIds: sentGuildIds,
              user: {
                connect: {
                  userId: interaction.user.id,
                },
              },
            },
          });
        await interaction.editReply({
          embeds: [send],
          components: [inv],
          ephemeral: true,
        });
      } else{
        const guilds = await db.guilds.findMany();
        
          let channels = [];
          guilds.forEach(guild => {
            if (guild.rssDtoFid) {
              channels = [...channels, ...guild.rssDtoFid];
            }
          });
        
          if (!channels.length) return;
        
          const scrimsearchEmbed = new EmbedBuilder()
            .setAuthor({
              name: `${interaction.user.displayName} is LFS`,
              iconURL: `http://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`,
              url: `https://discordapp.com/users/${interaction.user.id}/`, //eventually trying to add a direct link to the user profile in the future.
            })
            .setDescription(
              ` **${date} ${time} **     **Class ${rank}**     **${bestof} Maps**`
            )
            .addFields({
              name: "Extra Informations",
              value: `${extrainfo}`,
              inline: false,
            })
            .setColor("#ff7700")
            .setFooter({
              text: `Scrimfinder (scrimfinder.gg) | ${interaction.user.id}`,
              iconURL: "https://maierfabian.de/images/happypingu.png",
            })
            .setTimestamp();
        
            for (const c of channels) {
              const channelToSend = client.channels.cache.get(c);
              if (channelToSend) {
                const message = await channelToSend.send({
                  embeds: [scrimsearchEmbed],
                  components: [contactRow],
                });
            
                // Store the sent message ID, channel ID, and guild ID
                sentMessageIds.push(message.id);
                sentChannelIds.push(c);
                sentGuildIds.push(interaction.guild.id);
              }
            }
          if (shareranges == "yes") {
            const guilds = await db.guilds.findMany();
        
          let channels = [];
          guilds.forEach(guild => {
            if (guild.rssGtoIid) {
              channels = [...channels, ...guild.rssGtoIid];
            }
          });
        
          if (!channels.length) return;
        
          const scrimsearchEmbed = new EmbedBuilder()
            .setAuthor({
              name: `${interaction.user.displayName} is LFS`,
              iconURL: `http://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`,
              url: `https://discordapp.com/users/${interaction.user.id}/`, //eventually trying to add a direct link to the user profile in the future.
            })
            .setDescription(
              ` **${date} ${time} **     **Class ${rank}**     **${bestof} Maps**`
            )
            .addFields({
              name: "Extra Informations",
              value: `${extrainfo}`,
              inline: false,
            })
            .setColor("#ff7700")
            .setFooter({
              text: `Scrimfinder (scrimfinder.gg) | ${interaction.user.id}`,
              iconURL: "https://maierfabian.de/images/happypingu.png",
            })
            .setTimestamp();
        
            for (const c of channels) {
              const channelToSend = client.channels.cache.get(c);
              if (channelToSend) {
                const message = await channelToSend.send({
                  embeds: [scrimsearchEmbed],
                  components: [contactRow],
                });
            
                // Store the sent message ID, channel ID, and guild ID
                sentMessageIds.push(message.id);
                sentChannelIds.push(c);
                sentGuildIds.push(interaction.guild.id);
              }
            }

          /* Tweet the scrim
          const tweetContent = `📅 ${date} ${time} CET 🎮 ${rank} 🏆 Bo${bestof} \n\nExtra Informations: ${extrainfo} \n\n🎮 ${game} \n\n🔗 https://scrimfinder	.de`;
          await T.post('statuses/update', { status: tweetContent });
          console.log(`Tweeted: ${tweetContent}`);
          */
      

      }
      await db.message.create({
        data: {
          content: ` **${date} ${time} **     **Class ${rank}**     **${bestof} Maps**`,
          messageIds: sentMessageIds,
          channelIds: sentChannelIds,
          guildIds: sentGuildIds,
          user: {
            connect: {
              userId: interaction.user.id,
            },
          },
        },
      });
      await interaction.editReply({
        embeds: [send],
        components: [inv],
        ephemeral: true,
      });
    }}} catch (err) {
        console.log(err);
      }
    }
  }catch (err) {
    console.log(err);
  }
},
  data: new SlashCommandBuilder()
    .setName("findscrim")
    .setDescription("Find a scrim. Your class will automaticly get set")
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("The game you want to find a scrim for.")
        .addChoices({ name: "Rainbow Six Siege", value: "rss" })
        .setRequired(true)
    )

    .addStringOption((option) =>
      option.setName("best-of").setDescription("Best of.").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("The date you want to find a scrim for.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("The time you want to scrim.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("extra-info")
        .setDescription("Extra information about the scrim.")
    )
    .addStringOption((option) =>
      option
        .setName("shareit-everywhere")
        .addChoices({ name: "Yes", value: "yes" })
        .addChoices({ name: "no", value: "no" })
        .setDescription("Share the scrim in every channel you have access to.")
    )
    .setDMPermission(false)
    
};
