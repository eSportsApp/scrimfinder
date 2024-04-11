module.exports = (interaction, commandObj, handler, client) => {
    if (commandObj.botOwnerOnly) {
      if (interaction.member.id !== '516206348568887316' && interaction.member.id !== '1118919281300738058' ) { // Test if user is in the admin team
        interaction.reply('This command is only for the Admins'); // Set error message
        return true; // Stop command 
      }
    }
};