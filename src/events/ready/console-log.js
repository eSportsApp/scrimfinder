const { ActivityType } = require("discord.js");

module.exports = ( client ) => {
  // If bot started correctly, console log.
  console.log(`✅Logged in as ${client.user.tag}.`);
  console.log(`Bot is in ${client.guilds.cache.size} guilds.`);
  console.log(`Bot is serving ${client.guilds.cache.reduce((a,b) => a+b.memberCount, 0)} users.`);
  let members = client.guilds.cache.reduce((a,b) => a+b.memberCount, 0);
  let guilds = client.guilds.cache.size;
                                                                                 
                                                                                 

  //client.user.setActivity({
  //  name: "/findscrim",
  //  type: ActivityType.Listening
 // })
async function stats(){
members = client.guilds.cache.reduce((a,b) => a+b.memberCount, 0);
guilds = client.guilds.cache.size;
}
setInterval(stats, 60 * 60 * 1000);
//const states = [`Searching Scrims for ${members} Members.`, `Searching Scrims on ${guilds} Guilds.`,`scrimfinder.gg`, `Find Scrims easier with /findscrim`]; // Define the predefined states

 const states = [`loading esportsapp.gg`]; 
 let currentStateIndex = 0; 
 
 setInterval(() => {
     client.user.setPresence({
         activities: [{
             type: ActivityType.Custom,
             name: "irrelevant",
             state: states[currentStateIndex] // Set the next state
         }]
     });
 
     // Increment the index of the current state
     currentStateIndex = (currentStateIndex + 1) % states.length;
 }, 900000);
}

