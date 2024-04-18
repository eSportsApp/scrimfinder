const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { MessageActionRow, MessageButton, MessageEmbed, MessageButtonStyles } = require('discord.js');
const { db } = require("../../lib/db");
module.exports = {
    run: async ({ interaction }) => {
        let rank;
        const userInDB = await db.users.findFirst({
            where: {
              userId: interaction.user.id,
            },
          });
        let userId
          if (!userInDB) {
            await db.users.create({
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

        const profile = new EmbedBuilder()
        .setTitle("Youser Profile of " + interaction.user.username)
        .setURL("https://scrimfinder.de/")
        .setDescription(`**Username:** ${username}\n**User ID:** ${userId}\n**Class:** ${rank}`)
        .setColor("#ff7700")
        .setThumbnail(interaction.user.avatarURL())
        .setFooter({
          text: "Scrimfinder.de | Finding Scrims was never that easy",
          iconURL: "https://maierfabian.de/images/lovepingu.png",
        })
        .setTimestamp();

        const profilerow = new ActionRowBuilder()
        .addComponent(
            new ButtonBuilder()
            .setCustomId("wu")
            .setLabel("My Username is outdated")
            .setStyle(ButtonStyle.Primary)
        );

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
            embeds: [profile],
            components: [profilerow],
          });
    },
    data: new SlashCommandBuilder()
    .setName("myprofile")
    .setDescription("Shows your profile, like your class and more in some comming updates"),
};
//Acton row does not work