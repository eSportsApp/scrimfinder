const { db } = require("../lib/db");
module.exports = async ({interaction, commandObj, handler, client}) => {
    if (commandObj.staffonly) {
        // Query the betatester database for the user
        const user = await db.collection('betatesters').findOne({ userId: interaction.member.id });

        // If the user is not found in the database, reply with a message and stop the command
        if (!user) {
            interaction.reply('You must be a beta tester to use this command.').catch(console.error);
            return true; // Stop command 
        }
    }
};