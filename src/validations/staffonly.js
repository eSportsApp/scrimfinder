module.exports = (interaction, commandObj, handler, client) => {
    const adminIds = ['1118919281300738058', '405433753788219392', ]; // Array of admin IDs

    if (commandObj.staffonly) {
      if (!adminIds.includes(interaction.member.id)) { // Check if user ID is in the admin IDs array
        interaction.reply('This command is only for the Staff');
        return true; // Stop command 
      }
    }
};