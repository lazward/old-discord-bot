const config = require("./config.json") ;
const Discord = require("discord.js") ;
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const prefix = config.prefix ;
const ownerID = config.ownerID ;

console.log("Using token: " + config.token) ;

const client = new Discord.Client({disableEveryone: true}) ;

const SQLite = require("better-sqlite3") ;
const sql = new SQLite('./profiles.sqlite') ;

client.on("ready", () => {

  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = '{profiles}';") ;
  if (!table['count(*)']) {

    //sql.prepare("CREATE TABLE IF NOT EXISTS profiles (id TEXT PRIMARY KEY, user TEXT, title TEXT, desc TEXT, quote TEXT);").run() ;
    //sql.prepare("CREATE UNIQUE INDEX idx_profiles_id ON profiles (id);").run() ;
    sql.pragma("synchronous = 1") ;
    sql.pragma("journal_mode = wal") ;

  }

  client.getProfile = sql.prepare("SELECT * FROM profiles WHERE user = ?") ;
  client.setProfile = sql.prepare("INSERT OR REPLACE INTO profiles (id, user, title, desc, quote) VALUES (@id, @user, @title, @desc, @quote);") ;


  console.log("bot has started!") ;

}) ;

client.on("message", async message => {

  if(message.author.bot) {

    return ;

  }

  if(message.channel.type === "dm") {

    return ;

  }

  let messageArray = message.content.split(" ") ;
  let command = messageArray[0] ;
  let args = messageArray.slice(1) ;

  if (message.content.toLowerCase().replace(/\s/g,'').includes("johnsmith") || message.content.toLowerCase().replace(/\s/g,'').includes("horse")) {

    message.react('🐴') ;
    message.react('🐎') ;

  }

  if (message.content.toLowerCase().replace(/\s/g,'').includes("goodbot")) {

    message.react('328583701321744396') ;

  }

  if (!command.startsWith(prefix)) {

    return ;

  }

  if (command === `${prefix}userinfo`) {

    let user ;

    if (args[0]) {

      if (message.guild.members.find(user => user.displayName === args[0]) != undefined) {

       user = message.guild.members.find(user => user.displayName === args[0]).user ;

     }

    } else {

      user = message.author ;

    }

    if (user != undefined) {

      let profile = client.getProfile.get(user.id) ;

      if (!profile) {

        profile = buildProfile(user.id) ;

      }

      let embed = new Discord.RichEmbed()
        .setAuthor(message.guild.member(user).displayName, user.avatarURL)
        .setDescription(profile.title)
        .addField("Description", profile.desc)
        .addField("Discord Username", `${user.username}#${user
        .discriminator}`)
        .addField("Quote", profile.quote) ;


      message.channel.send(embed) ;


    } else {

      message.channel.send("Invalid name.") ;

    }


  }

  if (command === `${prefix}desc` || command === `${prefix}title` || command === `${prefix}quote`) {

    if (message.author.id === `${ownerID}`) {

      if (args[0]) {

      let member = message.guild.members.find('displayName', args[0]) ;
      if (member) {

        let newInfo = args.slice(1).join(" ") ;

        let profile = client.getProfile.get(member.id, member.guild.id) ;

        if (!profile) {

          profile = buildProfile(message.author.id) ;

        }

        switch(command) {

          case `${prefix}desc`:
          profile.desc = newInfo ;
          break ;
          case `${prefix}title`:
          profile.title = newInfo ;
          break ;
          case `${prefix}quote`:
          profile.quote = newInfo ;
          break ;


        }

        client.setProfile.run(profile) ;

      } else {

          message.channel.send("User not found!") ;

      }

    } else {

      message.channel.send("Please input a name.") ;

    }

  } else {

    message.channel.send("You can't use this command.") ;

  }

  }

  if (command === `${prefix}silence`) {

    const text = args.join(" ") ;

    const canvas = Canvas.createCanvas(742, 560);
  	const ctx = canvas.getContext('2d');

  	const image = await Canvas.loadImage('./silence.png');

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 20 + 'px ' + `sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    var width = ctx.measureText(text).width + 2 * 4;
    ctx.save();
    ctx.translate(28+334/2, 136);
    ctx.strokeRect(-334/2, 0, 334, 80);
    ctx.scale(334 / width, 80 / 20);
    ctx.translate(4, 0)
    ctx.fillText(text, -width/2, 0);
    ctx.restore();

  	const attachment = new Discord.Attachment(canvas.toBuffer(), 'silence.png');

    message.channel.send(attachment) ;

  }

}) ;

function buildProfile(user) {

    let output = {

              id: user.id,
              user: user,
              title: "placeholder",
              desc: "placeholder",
              quote: "placeholder"

          }

  return output ;

}

client.login(config.token) ;
