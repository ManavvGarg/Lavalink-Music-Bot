const { PREFIX } = require("../../config")
const db = require("quick.db")

module.exports =  {

	config: {
		name: 'jump',
		description: 'Skips to a song.',
		usage: '<seconds>',
		aliases: ['skipto', 'j'], 
	},
		
		run: async (bot, message, args) => {
			//prefix fetching and assigning
			let prefix;
			let fetched = await db.fetch(`prefix_${message.guild.id}`);
	
			if (fetched === null) {
				prefix = PREFIX
			} else {
				prefix = fetched
			}

			if (isNaN(args[0])) return message.channel.send('Invalid number.'); //check if the args provided by the user is a number or not.
			
			//check if the args provided by the user is currently playing song and if it is, return error message. 
            if (args[0] === 0) return message.channel.send(`Cannot skip to a song that is already playing. To skip the current playing song type: \`${prefix}skip\``); 
    
			const player = message.client.manager.players.get(message.guild.id); //fetch the player
			
            if ((args[0] > player.queue.length) || (args[0] && !player.queue[args[0] - 1])) return message.channel.send('Song not found.'); //check to see if the song is in the queue or not.
			
			const { title } = player.queue[args[0] - 1]; //grab the title of the song the player is jumoing to.

			if (args[0] == 1) player.stop();  //stop the player, if the song the player is jumping to is next in queue
			
            player.queue.splice(0, args[0] - 1); //jump to the song using the splice property.
			
			player.stop(); //stop the player to play the track we jumped to
    
            return message.channel.send(`Skipped to **${title}**.`);
	}
};