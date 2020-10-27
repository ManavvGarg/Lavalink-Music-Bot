const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { formatTime } = require('../../modules/functions');

module.exports = {
    config: {
        name: "nowplaying",
        description: "Now Playing command",
        aliases: ['np']
    },

    run: async(bot, message, args) => {

        const player = message.client.manager.players.get(message.guild.id);
        if(!player || !player.queue[0]) return message.channel.send("No song is currently playing in your guild!");
        
        const { title, author, thumbnail, duration } = player.queue.current;

        
        var date = new Date(0);
        date.setSeconds(duration); // specify value for SECONDS here
        var timeString = date.toISOString().substr(11, 8);

        const embed = new MessageEmbed()
        .setAuthor("Current song playing:", message.author.displayAvatarURL)
        .setThumbnail(thumbnail)
        .setDescription(stripIndents`
        ${player.playing ? "▶" : "⏸"} **${title}** \n\`by ${author}\`
        `)
        .setColor("#d9d9d9");

        return message.channel.send(embed);
    }
}