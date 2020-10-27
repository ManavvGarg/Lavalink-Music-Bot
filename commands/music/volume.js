module.exports = {
    config: {
        name: "volume",
        description: "Volume command",
        aliases: ['vol']
    },
    run: (bot, message, args) => {
      const player = message.client.manager.players.get(message.guild.id);
  
      if (!player) return message.reply("I have not joined a channel because I have nothing to play. Use the play command to play the song.");
      if (!args.length) return message.reply(`The player volume is \`${player.volume}\`.`)
  
      const { channel } = message.member.voice;
      
      if (!channel) return message.reply("You need to join a voice channel.");
      if (channel.id !== player.voiceChannel) return message.reply("You're not in the same voice channel.");
  
      const volume = Number(args[0]);
      
      if (!volume || volume < 1 || volume > 100) return message.reply("You need to give me a volume between 1 and 100.");
  
      player.setVolume(volume);
      return message.reply(`Done | Set the player volume to \`${volume}\`.`);
    }
  }