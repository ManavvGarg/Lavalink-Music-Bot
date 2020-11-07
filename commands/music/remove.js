const { PREFIX } = require("../../config")
const db = require("quick.db")


module.exports = {
    config: {
        
			name: 'remove',
			description: 'Removes a song from the queue',
			usage: '<song position> OR <song posi 1> <song posi 2> [To remove multiple songs]',
            aliases: ['removefrom', 'removerange'],
    },
	run: async(bot, message, args) => {
        //prefix checking and fetching
        let prefix;
        let fetched = await db.fetch(`prefix_${message.guild.id}`);

        if (fetched === null) {
            prefix = PREFIX
        } else {
            prefix = fetched
        }


		const player = message.client.manager.players.get(message.guild.id); // get the player

		if (isNaN(args[0])) return message.channel.send('Invalid number.'); //check if the args provided by the user is a number or not.

        //return error message if the command is used to remove the current playing song
        if (args[0] == 0) return message.channel.send(`Cannot remove a song that is already playing. To skip the song type: \`${prefix}skip\``); 

        if (args[0] > player.queue.length) return message.channel.send('Song not found.'); //check to see if the song exists in the queue.

        const { title } = player.queue[args[0] - 1]; //grab the title of, to be removed song

        player.queue.splice(args[0] - 1, 1); //remove the song using the splice property

        return message.channel.send(`Removed ***${title}*** from the queue`); 
	}
}