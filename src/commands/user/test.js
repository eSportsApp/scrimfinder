module.exports = {
    data: {
      name: 'ping',
      description: 'Pong!',
    },
   
    run: ({ interaction }) => {
      interaction.reply('Pong!');
    },
   
    options: {
      devOnly: true, // ✅
    },
  };