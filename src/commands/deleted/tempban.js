module.exports = {
    data: {
      name: 'tempban',
      description: 'Pong!',
    },
   
    run: ({ interaction }) => {
      interaction.reply('Pong!');
    },
    options: {
        deleted: true, // ✅
      },
    };