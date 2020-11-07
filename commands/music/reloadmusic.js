const Discord = require("discord.js")
const { readdirSync } = require("fs");

module.exports = {
    config: {
        name: "reloadmusic",
        description: "Reload command- Dev Only",
        aliases: ['rmusic']
    },

    run: async (bot, message, args) => {

      //embed
        const embed = new Discord.MessageEmbed()
        .setTitle("Reload")
        .setDescription("Sorry, the `reload` command can only be executed by the Developer.")
        .setColor("#cdf785");
        if(message.author.id !== '684092617272721420') return message.channel.send(embed); //check if the user of this command is an authorized user or not

        if(!args[0].toLowerCase()) return message.channel.send("Please provide a command name!") //check to see if args have been provided or not

        const commandName = args[0].toLowerCase() //assign a constant to the name of the command

    
      //Try-catch code block to check, delete and pull the provided comamnd
        try {
          delete require.cache[require.resolve(`./${commandName}.js`)] //fetch and delete the command cache using discord's delete require.cache property
          
          const pull = require(`./${commandName}.js`) //assign the name of the command to be re pulled

          bot.commands.set(pull.config.name, pull) //set the command again in the collection to enable it for usage

          message.channel.send(`Successfully reloaded: \`${commandName}\``) //after reloading , send a success message
        }

        catch (e) {
          console.log(e) //if an error occurs, console log it.

          return message.channel.send(`Could not Reload Command: ${commandName} From Music Module Because: \n` + "```js" + `${e}` + "```") //send the full error in the channel where the command was executed
        }


      }
}