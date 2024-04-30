module.exports = async (message, client) => {
    if (message.mentions.has(client.user)) {
        // Reply to the mention
        message.reply('Hey there! You mentioned me!');
    }
}