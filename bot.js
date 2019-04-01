const config = require("./config.json") ;
const Discord = require("discord.js") ;
const prefix = config.prefix ;

console.log("Using token: " + config.token) ;

const client = new Discord.Client({disableEveryone: true}) ;

const SQLite = require("better-sqlite3") ;
const sql = new SQLite('./profiles.sqlite') ;

client.on("ready", async () => {

  console.log("client has started!") ;

}) ;

client.on("message", async message => {

  if(message.author.client) {

    return ;

  }

  if(message.channel.type === "dm") {

    return ;

  }

  let messageArray = message.content.split(" ") ;
  let command = messageArray[0] ;
  let args = messageArray.slice(1) ;

  if (!command.startsWith(prefix)) {

    return ;

  }

  if (command === `${prefix}userinfo`) {

    let embed = new Discord.RichEmbed()
      .setAuthor(message.member.displayName, message.author.avatarURL)
      .setDescription("Test")
      .addField("Discord Username", `${message.author.username}#${message.author.discriminator}`) ;

    message.channel.send(embed) ;

  }

}) ;

client.login(config.token) ;
