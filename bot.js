const config = require("./config.json") ;
const Discord = require("discord.js") ;
const prefix = config.prefix ;

console.log("Using token: " + config.token) ;

const client = new Discord.Client({disableEveryone: true}) ;

const SQLite = require("better-sqlite3") ;
const sql = new SQLite('./profiles.sqlite') ;

client.on("ready", () => {

  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'profiles';") ;
  if (!table['count(*)']) {

    //sql.prepare("CREATE TABLE IF NOT EXISTS profiles (id TEXT PRIMARY KEY, user TEXT, guild TEXT, title TEXT, desc TEXT);").run() ;
    //sql.prepare("CREATE UNIQUE INDEX idx_profiles_id ON profiles (id);").run() ;
    sql.pragma("synchronous = 1") ;
    sql.pragma("journal_mode = wal") ;

  }

  client.getProfile = sql.prepare("SELECT * FROM profiles WHERE user = ? AND guild = ?") ;
  client.setProfile = sql.prepare("INSERT OR REPLACE INTO profiles (id, user, guild, title, desc) VALUES (@id, @user, @guild, @title, @desc);") ;


  console.log("bot has started!") ;

}) ;

client.on("message", message => {

  if(message.author.bot) {

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

    let profile = client.getProfile.get(message.author.id, message.guild.id) ;

    if (!profile) {

      profile = buildProfile(message.author.id, message.guild.id) ;

    }

    let embed = new Discord.RichEmbed()
      .setAuthor(message.member.displayName, message.author.avatarURL)
      .setDescription(profile.title)
      .addField("Description", profile.desc)
      .addField("Discord Username", `${message.author.username}#${message.author
      .discriminator}`) ;


    message.channel.send(embed) ;

  }

  if (command === `${prefix}desc`) {

    let member = message.guild.members.find('displayName', args[0]) ;
    if (member) {

      let newDesc = args.slice(1).join(" ") ;

      let profile = client.getProfile.get(message.author.id, message.guild.id) ;

      if (!profile) {

        profile = buildProfile(message.author.id, message.guild.id) ;

      }

      profile.desc = newDesc ;

      client.setProfile.run(profile) ;

    } else {

        message.channel.send("User not found!") ;

    }


  }

  if (command === `${prefix}title`) {

    let member = message.guild.members.find('displayName', args[0]) ;
    if (member) {

      let newTitle = args.slice(1).join(" ") ;

      let profile = client.getProfile.get(message.author.id, message.guild.id) ;

      if (!profile) {

        profile = buildProfile(message.author.id, message.guild.id) ;

      }

      profile.title = newTitle ;

      client.setProfile.run(profile) ;

    } else {

        message.channel.send("User not found!") ;

    }

  }

}) ;

function buildProfile(user, guild) {

    let output = {

              id: `${guild}-${user}`,
              user: user,
              guild: guild,
              title: "test",
              desc: "tesssst"

          }

  return output ;

}

client.login(config.token) ;
