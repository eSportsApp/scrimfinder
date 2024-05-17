module.exports = {
    data: {
      name: 'unban',
      description: 'Pong!',
    },
   
    run: ({ interaction }) => {
      interaction.reply('Pong!');
    },
    options: {
        deleted: true, // ✅
      },
    };