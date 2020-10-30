const { KSOFT_TOKEN } = require("../../config")

const Discord = require('discord.js');
const { KSoftClient } = require('ksoft.js');
const isAbsoluteUrl = require('is-absolute-url');

const ksoft = new KSoftClient(KSOFT_TOKEN);

module.exports = {
    config: {
        
			name: 'lyrics',
			description: 'Displays lyrics of a song.',
            usage: '<search query>',
            aliases: ['ly']
    },
	run : async(bot, message, args) => {
		const msg = await message.channel.send(`Fetching lyrics...`);

		let song = '';
		if (!args[0]) {
			const player = message.client.manager.players.get(message.guild.id);
			if (!player) return message.channel.send('Please provide a song to search for lyrics or play a song.');
			else song = player.current.title;
		}
		else { song = args.join(' '); }

		if(isAbsoluteUrl(song)) return msg.edit('Please provide a song name. Links are not supported.');
		const data = await ksoft.lyrics.get(song, false)
			.catch(err => {
				return message.channel.send(err.message);
			});
		const embed = new Discord.MessageEmbed()
			.setTitle(`${data.name}`)
			.setAuthor(`${data.artist.name}`)
			.setDescription(data.lyrics.slice(0, 2044) + '...')
			.setColor('#d9d9d9')
			.setFooter('Powered by KSoft.Si');
		msg.edit('', embed);
	}
};