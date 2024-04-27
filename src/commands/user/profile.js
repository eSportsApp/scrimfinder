const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { MessageActionRow, MessageButton, MessageEmbed, MessageButtonStyles } = require('discord.js');
const { db } = require("../../lib/db");
module.exports = {
    run: async ({ interaction }) => {
      let userInDB = await db.users.findFirst({
        where: {
          userId: interaction.user.id,
        },
      });
      
      let rank;
      let username;
      let userId;
      
      if (!userInDB) {
        userInDB = await db.users.create({
          data: {
            userId: interaction.user.id,
            username: interaction.user.username,
            rssclass: "I",
          },
        });
        rank = "I";
        username = interaction.user.username;
      }
      if (userInDB){
        rank = userInDB.rssclass;
        username = userInDB.username;
        userId = userInDB.userId;
      }
      
      userInDB = await db.users.findUnique({
        where: {
          userId: interaction.user.id,
        },
        include: {
          messages: true,
        },
      });

      const profile = new EmbedBuilder()
      .setTitle("Youser Profile of " + interaction.user.username)
      .setURL("https://scrimfinder.de/")
      .setDescription(`**Username:** ${username}\n**User ID:** ${userId}\n**Class:** ${rank}`)
      .setColor("#ff7700")
      .setThumbnail(interaction.user.avatarURL());
    
    // Add active searches to the embed
    if (userInDB && userInDB.messages) {
      if (userInDB.messages.length === 0) {
        profile.addFields({ name: 'Active Searches', value: 'No active searches' });
      } else {
        for (const message of userInDB.messages) {
          profile.addFields({ name: `Search #${userInDB.messages.indexOf(message) + 1}`, value: message.content });
        }
      }
    }


        

        if (interaction.customId == "wu") {
            if (userId == interaction.user.id) {
              await db.users.update({
                where: {
                  userId: interaction.user.id,
                },
                data: {
                  username: interaction.user.username,
                },
              });
            }else {
                await interaction.reply({
                    content: "You can't update the username of another user",
                    ephemeral: true,
                });
            }
          }

        await interaction.reply({
            embeds: [profile]
            
          });
    },
    data: new SlashCommandBuilder()
    .setName("myprofile")
    .setDescription("Shows your profile, like your class and more in some comming updates"),
};
//Acton row does not work