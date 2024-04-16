

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { db } = require("../../lib/db");
staffonly: true,
module.exports = {
    run: async ({ interaction }) => {


 

        const userId = interaction.options.getString("userid");
        const newclass = interaction.options.getString("newclass");
        const guild = await interaction.client.guilds.fetch('1201205703742869504'); // Replace 'GUILD_ID' with your server's ID
        const member = await guild.members.fetch(userId);
        
        const e404 = new EmbedBuilder()
        .setTitle("User not found!")
        .setURL("https://scrimfinder/")
        .setDescription("The User you are looking for is not in the Database \n\n The user has to interact with the bot first to be in the Database")
        .setColor("#ff7700")
        .setFooter({
          text: "Scrimfinder.de | Finding Scrims was never that easy",
          iconURL: "https://maierfabian.de/images/lovepingu.png",
        })
        .setTimestamp();
        const success = new EmbedBuilder()
        .setTitle("Class successfully set!")
        .setURL("https://scrimfinder/")
        .setDescription(`The class of the user with the ID ${userId} has been successfully set to ${newclass}`)
        .setColor("#ff7700")
        .setFooter({
          text: "Scrimfinder.de | Finding Scrims was never that easy",
          iconURL: "https://maierfabian.de/images/lovepingu.png",
        })
        .setTimestamp();
        try {
            // Check if user is in the database
            const userInDB = await db.users.findFirst({
              where: {
                userId: userId,
              },
            });
      
            if (!userInDB) {
              await interaction.reply({embeds: [e404]}.ephemeral = true);
              return;
            } 
            if (userInDB) {
                await db.users.update({
                    where: {
                    userId: userId,
                    },
                    data: {
                    rssclass: newclass,
                    },
                });
                 // Define the roles to remove
  const roles = ['1210226456123277322', '1227726730404565135']; // Replace these with the IDs of the roles

  // Remove all the roles from the user
  for (const role of roles) {
    if (member.roles.cache.has(role)) {
      await member.roles.remove(role);
    }
  }
let roleID;
  //sets the role for each class on the official class system Server
  if(newclass == "I") {
  roleId = "1229702185223192638";
  }else if (newclass == "H") {
     roleId = "1229702185223192637";
  }
  else if (newclass == "G") {
     roleId = "roleid";
  } else if (newclass == "F") {
     roleId = "roleid";
  } else if (newclass == "E") {
     roleId = "roleid";
  } else if (newclass == "D") {
     roleId = "roleid";
  } else if (newclass == "C") {
     roleId = "roleid";
  } else if (newclass == "B") {
     roleId = "1210226456123277322";
  }
  else if (newclass == "A") {
     roleId = "roleid";
  }
    
  // Find the role in the guild by its ID
  const roleToAdd = guild.roles.cache.get(roleId);

  // Check if the role exists
  if (roleToAdd) {
    // Add the role to the member
    await member.roles.add(roleToAdd);
  } else {
    // Handle the case where the role does not exist
    console.log(`Role with ID ${roleId} does not exist.`);
  }
//this is the reply to the user idk why it doesn't work with the embed
const replyContent = `Class from <@${userID}> updated to ${newclass}`; 
interaction.reply({content: replyContent, ephemeral: true});
              } 
        } catch (err) {
            console.log(err);
        }


    },
    data: new SlashCommandBuilder()
    .setName("setclass")
    .setDescription("This command is only for the Staff")
    .addStringOption(option =>
        option
        .setName('newclass')
        .setDescription("the new class you want to give the user") 
        .addChoices(
          { name: "I", value: "I" },
          { name: "H", value: "H" },
          { name: "G", value: "G" },
          { name: "F", value: "F" },
          { name: "E", value: "E" },
          { name: "D", value: "D" },
          { name: "C", value: "C" },
          { name: "B", value: "B" },
          { name: "A", value: "A" }
        )
        .setRequired(true)
    )
    .addStringOption(option =>
        option
        .setName('userid')
        .setDescription("The Id of the User you want to give the class to")
        .setRequired(true))
};


