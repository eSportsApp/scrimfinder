module.exports = async (message, client) => {
    console.log(`${client.user.tag} was mentioned in ${message.guild.name} by ${message.author.tag}`)
    if (message.mentions.has(client.user)) {
        // Reply to the mention
        console.log(`Mentioned by ${message.author.tag}`);
        message.reply('Hey there! You mentioned me!');
    }
}