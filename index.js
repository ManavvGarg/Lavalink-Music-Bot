//====================================================================================CONSTANTS REQUIRED ON READY=============================================================================================
const { Client, Collection, MessageEmbed, Structures, MessageAttachment } = require('discord.js');
const { PREFIX, TOKEN } = require('./config');
const bot = new Client({ disableMentions: 'everyone' });
const fs = require("fs");
const db = require('quick.db');
const canvacord = require("canvacord")
//============================================================================================================================================================================================================


//====================================================================================COLLECTIONS REQUIRED ON READY===========================================================================================
bot.commands = new Collection();
bot.aliases = new Collection();
bot.snipes = new Collection();

//============================================================================================================================================================================================================



//============================================================================================INITIALIZING====================================================================================================
["aliases", "commands"].forEach(x => bot[x] = new Collection());
["console", "command", "event"].forEach(x => require(`./handler/${x}`)(bot));

bot.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
});

//============================================================================================================================================================================================================




//========================================================================================GiveawayManagerModule==============================================================================================

const { GiveawaysManager } = require('discord-giveaways');
bot.giveawaysManager = new GiveawaysManager(bot, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        exemptPermissions: [ "MANAGE_MESSAGES", "ADMINISTRATOR" ],
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});

//============================================================================================================================================================================================================



//=============================================================================================MULTI SNIPE====================================================================================================

bot.on("messageDelete", async (message) => {
    try {
      if (message.author.bot) return;
      const snipes = message.client.snipes.get(message.channel.id) || [];
      snipes.unshift({
        content: message.content,
        author: message.author,
        image: message.attachments.first()
          ? message.attachments.first().proxyURL
          : null,
        date: new Date().toLocaleString("en-GB", {
          dataStyle: "full",
          timeStyle: "short",
        }),
      });
      snipes.splice(20);
      message.client.snipes.set(message.channel.id, snipes);
    } catch (e) { console.log(e) }

    try {
        
      let embed = new MessageEmbed()
      .setTitle(`New message deleted!`)
      .setDescription(
        `**The user \`${message.author.tag}\` has deleted a message in <#${message.channel.id}>**`
      )
      .addField(`Content:`, message.content, true)
      .setColor(`RED`);
    let channel = db.fetch(`modlog_${message.guild.id}`)
    let ctx = bot.guilds.cache.get(message.guild.id).channels.cache.get(channel)
    if (!ctx) return;
    ctx.send(embed)

    }
    catch(e) { console.log(e) }
    });

//============================================================================================================================================================================================================




//=========================================================================================AFK AND MENTION SETTINGS===========================================================================================

bot.on('message', async message => {


    let prefix;
        try {
            let fetched = await db.fetch(`prefix_${message.guild.id}`);
            if (fetched == null) {
                prefix = PREFIX
            } else {
                prefix = fetched
            }
        
            } catch (e) {
            console.log(e)
    };
    try {
        if (message.mentions.has(bot.user.id) && !message.content.includes("@everyone") && !message.content.includes("@here")) {
          message.channel.send(`\nMy prefix for \`${message.guild.name}\` is \`${prefix}\` Type \`${prefix}help\` for help`);
          }
          
    } catch {
        return;
    };

//============================================================================================== AFK =========================================================================================================
let afk = db.fetch(`afk_${message.guild.id}_${message.author.id}`)
 

if(afk && !message.content.startsWith(`${prefix}afk`)){
   
 let mentions =  db.fetch(`mentions_${message.guild.id}_${message.author.id}`)
if(!mentions) mentions  = 0;
    message.channel.send(`You are no longer afk for [   ${afk}   ] \nWhile afk you got \`${mentions}\` ping(s)`)
    
    db.delete(`afk_${message.guild.id}_${message.author.id}`)
    db.delete(`mentions_${message.guild.id}_${message.author.id}`)
 }
 if(message.mentions.users.first()){
     let user = message.mentions.users.first();
     let uafk = db.fetch(`afk_${message.guild.id}_${user.id}`)
if(uafk){ db.add(`mentions_${message.guild.id}_${user.id}`,1)
message.channel.send(`\`${user.username}\` is currently afk: ${uafk}`)

}
 }
});

//============================================================================================================================================================================================================


//================================================================================================ WELCOME ===================================================================================================
bot.on("guildMemberAdd", (member) => {
    let chx = db.get(`welchannel_${member.guild.id}`);
    let msg = db.get(`welmsg_${member.guild.id}`);
  
    if(chx === null) {
      return;
    }
  
    let welcomeIMG = new canvacord.Welcomer(
      {
        username: member.user.username,
        discrim: member.user.discriminator,
        avatarURL: member.user.displayAvatarURL()
      }
    )
    canvacord.write(image, "welcome.png");
    let attachment = new MessageAttachment(image, "welcome.png");

    bot.channels.cache.get(chx).send(attachment);
  
})

//============================================================================================================================================================================================================


bot.login(TOKEN);