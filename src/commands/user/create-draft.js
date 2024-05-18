const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const { db } = require("../../lib/db");


module.exports = {
    run: async ({ interaction, client }) => {
        const time = interaction.options.getString('time');
const maps = interaction.options.getString('maps');

        let userInDB = await db.users.findUnique({
            where: {
                userId: interaction.user.id,
            },
            include: {
                drafts: true,
            },
        });
        const draftContent = interaction.options.getString('content');


        if (!userInDB) {
            await interaction.reply({content:'You are not yet registered on the bot. Search at least one Scrim to create drafts', ephemeral: true});
        } else {
            // Check if the user already has 3 drafts
            if (userInDB.drafts.length >= 3) {
                // Create an embed message
                const embed = new EmbedBuilder()
                    .setTitle('You already have 3 drafts')
                    .setDescription('Please choose a draft to overwrite.');
                    userInDB.drafts.forEach((draft, index) => {
                    //.addField(`Draft ${index + 1}`, draft.content);
                    }
                    );
                // Create an action row
               

                // Reply with the embed message and the action row
                await interaction.reply({embeds: [embed.build()], components: [row], ephemeral: true});

                // Create a collector to listen for button clicks
                const filter = i => i.customId.startsWith('overwrite_draft') && i.user.id === interaction.user.id;
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 5 * 60 * 1000 });

                collector.on('collect', async i => {
                    const index = parseInt(i.customId.split('_')[2]) - 1;

                    // Overwrite the selected draft
                    await db.draft.update({
                        where: {
                            id: userInDB.drafts[index].id,
                        },
                        data: {
                            time: time,
                            maps: maps,
                        },
                    });
                    await i.update({content: 'Draft overwritten', components: []});
                });

                collector.on('end', collected => {
                    if (collected.size === 0) {
                        interaction.editReply({content: 'Process cancelled due to inactivity.', components: []});
                    }
                });
            } else {
                // Create a new draft
                const newDraft = await db.draft.create({
                    data: {
                        time: time,
                        maps: maps,
                    },
                });

                // Create a new UserDraft record
                await db.userDraft.create({
                    data: {
                        userId: userInDB.id,
                        draftId: newDraft.id,
                    },
                });

                await interaction.reply({content: 'Draft saved', ephemeral: true});
            }
        }
    },
    data: new SlashCommandBuilder()
        .setName("savedraft")
        .setDescription("Save a draft.")
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription("The time of your Scrim")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("maps")
                .setDescription("How many Maps you want to play")
                .setRequired(true)
        ),
        options: {
            devOnly: true, // ✅
          },
        
};