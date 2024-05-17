module.exports = {
    data: {
      name: 'register',
      description: 'Pong!',
    },
   
    run: ({ interaction }) => {
      interaction.reply('Pong!');
    },
    options: {
        deleted: true, // ✅
      },
    };