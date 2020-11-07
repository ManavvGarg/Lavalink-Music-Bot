const { PREFIX } = require("../../config")
const db = require("quick.db")

module.exports =  {

	config: {
		name: 'seek',
		description: 'Skips to a timestamp in the song.',
		usage: '<seconds>',
		aliases: ['ff']
	},
		
		run: async (bot, message, args) => {
			//prefix checking and fecthing
			let prefix;
			let fetched = await db.fetch(`prefix_${message.guild.id}`);
	
			if (fetched === null) {
				prefix = PREFIX
			} else {
				prefix = fetched
			}


			//check if the args provided by the user is a number or not, if not, then return with a mesage saying, invalid number

		if(isNaN(args[0]) && args[0] < 0) return message.reply(`Invalid number. Please provide a number in seconds.\nCorrect Usage: \`${prefix}seek <seconds>\``);

		const player = message.client.manager.players.get(message.guild.id); //get the player.

		if(args[0] * 1000 >= player.queue.current.length || args[0] < 0) return message.channel.send('Cannot seek beyond length of song.'); //check and parse the song duration. Required for seeking

		player.seek(args[0] * 1000); //seek property of erela.js, seeks the song to the provided duration

		return message.channel.send(`Seeked ${args[0]} second(s)`);
	}
};