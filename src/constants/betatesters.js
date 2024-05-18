const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { db } = require("../lib/db");
async function betatester (searchId, interaction, client){
    const userId = searchId.split(' ')[1];
                const user = await client.users.fetch(userId);
                if (user) {
                    await db.betatesters.create({
                        data: {
                            userId: userId,
                        },
                    });
                    const embed = new EmbedBuilder()
                    .setTitle("Welcome to the Scrimfinder Beta Program!")
                    .setDescription("Welcome in the Scrimfinder Beta Program! You will now have access to new features before they are released to the public. We will contact you when we have new features to test. Thank you for your support!")
                    .setFields({ name: 'Disclaimer', value: "If you want to opt out please write foxyyy a dm.\n All features you test are experimental and can contain Bugs. You are obliged to report bugs as they occure." })
                    .setColor("#ff7700")
                    .setThumbnail("https://maierfabian.de/images/hipingu.png")

                    const button = new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel("Report a Bug")
                        .setURL("https://forms.gle/2FtXsZb7xyT4GYd47");

                    const actionRow = new ActionRowBuilder().addComponents(button);

                    
                await user.send({ embeds: [embed], components: [actionRow]});
                await interaction.reply({ content: `User with ID ${userId} has been added to the beta program.`, ephemeral: true });
            } else {
                await interaction.reply({ content: `User with ID ${userId} not found.`, ephemeral: true });
            }
}
module.exports = {
    betatester: betatester,
};