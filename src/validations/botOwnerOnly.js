module.exports = (interaction, commandObj, handler, client) => {
    if (commandObj.botOwnerOnly) {
      if (interaction.member.id !== '516206348568887316') { // Test if user is foxyyy or not
        interaction.reply('This command is only for the Admins'); // Set error message
        return true; // Stop command 
      }
    }
};