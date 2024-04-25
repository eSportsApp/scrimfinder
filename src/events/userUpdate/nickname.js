
module.exports = async (oldUser, newUser, client) => {
    const userIdToCheck = '1142117861674975353'; // Replace with the user ID you want to check
//does not work idk why to fucked up to look after it (doesn't give errors so I will let it here)
    if (oldUser.username !== newUser.username && newUser.id === userIdToCheck) {
        if (newUser.username !== 'Scrimfinder') {
            client.user.setUsername('Scrimfinder')
                .then(updatedUser => {
                    console.log(`Username changed back to Scrimfinder for user ${updatedUser.tag}`);
                    updatedUser.send('Your username has been changed back to Scrimfinder.');
                })
                .catch(console.error);
        }
    }
};

