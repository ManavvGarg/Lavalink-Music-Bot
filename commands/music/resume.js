module.exports = {
    config: {
        name: "resume",
        description: "Resume command",
        aliases: ['r']
    },
    run: async(bot, message) => {
      const player = message.client.manager.players.get(message.guild.id);
      if (!player) return message.reply("I have not joined a channel because I have nothing to play. Use the play command to play the song.");
  
      const { channel } = message.member.voice;
      
      if (!channel) return message.reply("You need to join a voice channel.");
      if (channel.id !== player.voiceChannel) return message.reply("You're not in the same voice channel.");
      if (!player.paused) return message.reply("The player is already resumed.");
  
      player.pause(false);
      return message.reply("Resumed the player.");
    }
  }