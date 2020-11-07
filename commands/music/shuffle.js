
module.exports = {
    config: {
        name: "shuffle",
        description: "Now Playing command",
        aliases: ['shuf']
    },

    run: async(bot, message, args) => {
        const player = message.client.manager.players.get(message.guild.id); //get the player
        
        const { channel } = message.member.voice; //get the member voice channel
        
        if (!channel) return message.reply('You need to join a voice channel.'); //if the user has not joined any voice channel, return.
        
        if(!player || !player.queue[0]) return message.channel.send("No song is currently playing in this guild."); //Check if the player is playing a song, or have tracks in queue.
        
        player.queue.shuffle(); //shuffle property of erela.js manager player. Shuffles track automatically in any random order.
        
        return message.channel.send("The queue is now shuffled.");
    }
}