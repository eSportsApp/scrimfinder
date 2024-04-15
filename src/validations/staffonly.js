module.exports = (interaction, commandObj, handler, client) => {
    const adminIds = ['516206348568887316','1118919281300738058', '405433753788219392', '172795776144113666', '1135832860109062154', '425737790043586560', '172678686938628096', '406184854393192449','431481500593160203','522686372268605445','402841102601945088', '311919918700298241','186815680002129920','431543806102601738','418439190443851778' ]; // Array of admin IDs
//  const adminIds = ['foxyyy','cat', 'eaglemess','Fancy Pixel', 'Ryzl', RandoSando', 'eden', 'Uknow','titan','NOCTish','ProphetKing','Jxmz','Kiba','MsamiX','Safe' ];
    if (commandObj.staffonly) {
      if (!adminIds.includes(interaction.member.id)) { // Check if user ID is in the admin IDs array
        interaction.reply('This command is only for the Staff');
        return true; // Stop command 
      }
    }
};