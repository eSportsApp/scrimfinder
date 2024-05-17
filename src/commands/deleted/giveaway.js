module.exports = {
    data: {
      name: 'giveaway',
      description: 'Pong!',
    },
   
    run: ({ interaction }) => {
      interaction.reply('Pong!');
    },
    options: {
        deleted: true, // ✅
      },
    };