const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { db } = require("../lib/db");

module.exports = {
    run: async ({ interaction }) => {
//Embeds
//Response for Banned Users
        const banned = new EmbedBuilder()
        .setTitle("Sry you are banned from the Bot!")
        .setURL("https://scrimfinder.gg")
        .setDescription("It seems like you are banned from the bot. If you think this is a mistake, please contact us.")
        .setColor("#ff7700")
        .setTimestamp();

//Response for already registered Servers
        const alreadyregistered = new EmbedBuilder()
        .setTitle("Your Server is already registered!")
        .setURL("https://scrimfinder.gg")
        .setDescription("It seems like your server is already registered. You didn't register don't worry the bot did this by himself. You are ready to set up the channels now :).")
        .setColor("#ff7700")
        .setTimestamp();

//Response for successfully registered Servers
const registerd = new EmbedBuilder()
        .setTitle("Your Server is now registered!")
        .setURL("https://scrimfinder.gg")
        .setDescription("Successfully registered your server! Have fun using this bot :). \n\n If you need help, visit our [docs](https://docs.scrimfinder.de) or join our [Support Server](https://discord.gg/division-league-833783529506078781)")
        .setColor("#ff7700")
        .setTimestamp();
//Buttons
  const docs = new ActionRowBuilder()
  .addComponents(
      new ButtonBuilder()
          .setURL('https://docs.scrimfinder.de')
          .setLabel('Visit the docs')
          .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
          .setURL('https://discord.gg/division-league-833783529506078781')
          .setLabel('Join the Support Server')
          .setStyle(ButtonStyle.Link),
  )



          
        try {
            
            const guildId = interaction.guildId;

            const bannedUser = await db.bannedUsers.findFirst({
                where: {
                    userId: interaction.user.id
                }
            })

            if(bannedUser) {
                await interaction.reply({ 
                    embeds: [banned], 
                    components: [docs] })
            }

            const guildDB = await db.guilds.findFirst({
                where: {
                    guildId: guildId
                }
            })

            if(guildDB) {
                await interaction.reply({ 
                    embeds: [alreadyregistered], 
                    components: [docs] })
            }else {

            const newDBGuild = await db.guilds.create({
                data: {
                    guildId: guildId,
                }
            })

            await interaction.reply({ 
                embeds: [registerd], 
                components: [docs] })}

        } catch (err) {
            console.log(err)
        }
    },
    data: new SlashCommandBuilder().setName("register").setDescription("Register your server to use Scrimfinder. This is necessary to use this bot.").setDMPermission(false)

}