const { ActivityType } = require("discord.js");

module.exports = ( client ) => {
  // If bot started correctly, console log.
  console.log(`✅Logged in as ${client.user.tag}.`);
  console.log(`Bot is in ${client.guilds.cache.size} guilds.`);
  console.log(`Bot is serving ${client.guilds.cache.reduce((a,b) => a+b.memberCount, 0)} users.`);

                                                                                 
                                                                                 

  //client.user.setActivity({
  //  name: "/findscrim",
  //  type: ActivityType.Listening
 // })

      setInterval(() => {
        const states = [`Searching Scrims for ${client.guilds.cache.reduce((a,b) => a+b.memberCount, 0)} Members.`, `Searching Scrims on ${client.guilds.cache.size} Guilds.`,`Need Help? Run the /help Command!`]; // Define the predefined states
        let currentStateIndex = 0; // Initialize the index of the current state

          client.user.setPresence({
            activities: [{
              type: ActivityType.Custom,
              name: "irrelevant",
              state: states[currentStateIndex] // Set the next state
            }]
          });
        }, 30000);}

