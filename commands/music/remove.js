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
        let prefix;
        let fetched = await db.fetch(`prefix_${message.guild.id}`);

        if (fetched === null) {
            prefix = PREFIX
        } else {
            prefix = fetched
        }

		const player = message.client.manager.players.get(message.guild.id);

		if (isNaN(args[0])) return message.channel.send('Invalid number.');

        if (args[0] == 0) return message.channel.send(`Cannot remove a song that is already playing. To skip the song type: \`${prefix}skip\``);
        if (args[0] > player.queue.length) return message.channel.send('Song not found.');

        const { title } = player.queue[args[0] - 1];

        player.queue.splice(args[0] - 1, 1);
        return message.channel.send(`Removed ***${title}*** from the queue`);
	}
}