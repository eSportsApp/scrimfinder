module.exports = {
    data: {
      name: 'db',
      description: 'Pong!',
    },
   
    run: ({ interaction }) => {
      interaction.reply('Pong!');
    },
    options: {
        deleted: true, // ✅
      },
    };