const levels = {
    none: 0.0,
    low: 0.20,
    medium: 0.30,
    high: 0.35,
  };
  
  module.exports = {

    config: {
        name: "bassboost",
        aliases: ['bb']
    },

    run: async(bot, message, args) => {
      const player = message.client.manager.players.get(message.guild.id);
      if (!player) return message.reply("I have not joined a channel because I have nothing to play. Use the play command to play the song.");
  
      const { channel } = message.member.voice;
      
      if (!channel) return message.reply("You need to join a voice channel.");
      if (channel.id !== player.voiceChannel) return message.reply("You're not in the same voice channel.");
  
      if(!args) return message.channel.send("You need to provide a bassboost level. Available Levels are, `none`, `low`, `medium`, `high`.")

      let level = "none";
      if (args.length && args[0].toLowerCase() in levels) level = args[0].toLowerCase();
  
      player.setEQ(...new Array(3).fill(null).map((_, i) => ({ band: i, gain: levels[level] })));
  
      return message.reply(`Done | Set the bassboost level to ${level}`);
    }
  }