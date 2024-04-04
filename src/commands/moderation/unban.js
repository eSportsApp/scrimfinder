const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../../lib/db");

module.exports = {
  botOwnerOnly: true,
  run: async ({ interaction }) => {
    const userId = interaction.options.getString("userid");

    try {

      const bannedUser = await db.bannedUsers.findFirst({
        where: {
          userId: userId
        }
      })

      if(!bannedUser) {
        await interaction.reply("This user isn't banned.");
      }

      const unbanUser = await db.bannedUsers.delete({
        where: {
          userId: userId
        }
      })

      await interaction.reply({content: `Successfully unbanned <@${userId}>!`, ephemeral: true})
    } catch (err) {
      console.log(err)
    }

  },
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user from the system (OWNER ONLY!)")
    .addStringOption(option => option.setName("userid").setDescription("The user ID of the user you want to unban").setRequired(true)),
};
