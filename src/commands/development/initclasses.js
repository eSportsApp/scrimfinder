const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { db } = require("../../lib/db");
module.exports = {
    run: async ({ interaction }) => {
        // Rolle ID, nach der gesucht werden soll
        const roleId = '1227726730404565135'; // Replace with the actual role ID

        // Finde die Rolle im Server
        const role = interaction.guild.roles.cache.get(roleId);

        // Überprüfe, ob die Rolle existiert
        if (!role) {
            return interaction.channel.send(`Die Rolle mit ID ${roleId} existiert nicht.`);
        }

        // Finde alle Benutzer mit der Rolle
        const usersWithRole = interaction.guild.members.cache.filter(member => member.roles.cache.has(role.id));

        // Füge die Benutzer zur Datenbank hinzu
        usersWithRole.forEach(async user => {
            const newDBUser = await db.users.create({
                data: {
                    userId: user.id,
                    username: user.user.username,
                    rssclass: 'A'
                }
            })

            // Füge den Benutzer zur Datenbank hinzu
            
        });

        interaction.channel.send(`Alle Benutzer mit der Rolle ${role.name} wurden zur Datenbank hinzugefügt.`);
    },
    data: new SlashCommandBuilder().setName("init").setDescription("This command initializes the classes in the database. Only devs")
};
