const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { db } = require("../../lib/db");
module.exports = {
    run: async ({ interaction }) => {
        // Rolle ID, nach der gesucht werden soll
        const roleId = '1229702185223192638'; // Replace with the actual role ID

        // Finde die Rolle im Server
        const role = interaction.guild.roles.cache.get(roleId);

        // Überprüfe, ob die Rolle existiert
        if (!role) {
            return interaction.channel.send(`Die Rolle mit ID ${roleId} existiert nicht.`);
        }

        // Finde alle Benutzer mit der Rolle
        const usersWithRole = interaction.guild.members.cache.filter(member => member.roles.cache.has(role.id));
        // Convert the usersWithRole collection to an array
        const usersArray = Array.from(usersWithRole.values());
        console.log(usersArray);
      try{  // Check if there are no users with the role
        if (usersArray.length === 0) {
            return interaction.channel.send(`Es gibt keine Benutzer mit der Rolle ${role.name}.`);
        }
        // Use Promise.all to wait for all database operations to complete
        await Promise.all(usersArray.map(async user => {
            
            const newDBUser = await db.users.create({
                data: {
                    userId: user.id,
                    username: user.user.username,
                    rssclass: 'A'
                }
            })
      }));
    

        interaction.channel.send(`Alle Benutzer mit der Rolle ${role.name} wurden zur Datenbank hinzugefügt.`);
    }catch (error) {
        console.log(error);
    }}
    ,
    data: new SlashCommandBuilder().setName("init").setDescription("This command initializes the classes in the database. Only devs")
};
