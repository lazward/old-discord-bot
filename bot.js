const config = require("./config.json");
const Discord = require("discord.js");
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const prefix = config.prefix;
const ownerID = config.ownerID;

const client = new Discord.Client({
  disableEveryone: true
});

const fs = require("fs");
client.profiles = require("./profiles.json");

/*

const SQLite = require("better-sqlite3");
const sql = new SQLite('./profiles.sqlite');

*/

client.on("ready", () => {

  /*

  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = '{profiles}';");
  if (!table['count(*)']) {

    //sql.prepare("CREATE TABLE profiles (id TEXT PRIMARY KEY, user TEXT, title TEXT, desc TEXT, quote TEXT);").run() ;
    //sql.prepare("CREATE UNIQUE INDEX idx_profiles_id ON profiles (id);").run() ;
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");

  }

  client.getProfile = sql.prepare("SELECT * FROM profiles WHERE user = ?");
  client.setProfile = sql.prepare("INSERT OR REPLACE INTO profiles (id, user, title, desc, quote) VALUES (@id, @user, @title, @desc, @quote);");
*/

  console.log("bot has started!");

});

client.on("message", async message => {

  if (message.author.bot) {

    return;

  }

  if (message.channel.type === "dm") {

    return;

  }

  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if (message.content.toLowerCase().replace(/\s/g, '').includes("johnsmith") || message.content.toLowerCase().replace(/\s/g, '').includes("horse")) {

    message.react('🐴')
      .then(() => message.react('🐎'))
      .catch(() => console.error('couldnt horse react :,('));

  }

  if (message.content.toLowerCase().replace(/\s/g, '').includes("goodbot")) {

    message.react('328583701321744396');

  }

  if (!command.startsWith(prefix)) {

    return;

  }

  if (command === `${prefix}whois`) {

    let user;

    if (args.join(" ")) {

      if (message.guild.members.find(user => user.displayName === args.join(" ")) != undefined) {

        user = message.guild.members.find(user => user.displayName === args.join(" ")).user;

      }

    } else {

      user = message.author;

    }

    if (user != undefined) {

      if (!user.bot) {

        if (!client.profiles[user.id]) {

          client.profiles[user.id] = {

            name: message.guild.member(user).displayName,
            title: "placeholder",
            description: "placeholder",
            quote: "placeholder"

          }

          fs.writeFile("./profiles.json", JSON.stringify(client.profiles, null, 4), err => {
            if (err) throw err;
          });

        }

        let embed = new Discord.RichEmbed()
          .setAuthor(message.guild.member(user).displayName, user.avatarURL)
          .setDescription(client.profiles[user.id].title)
          .addField("Description", client.profiles[user.id].description)
          .addField("Discord Username", `${user.username}#${user
                .discriminator}`)
          .addField("Quote", client.profiles[user.id].quote);


        message.channel.send(embed);


      } else {

        if (user.id === '274255132454289408') {

          message.channel.send('', {files: ["./joke.png"]}) ;

        } else {

          message.channel.send("That is a bot.");

        }

      }

    } else {

      message.channel.send("Invalid name.");

    }


  } else if (command === `${prefix}desc` || command === `${prefix}title` || command === `${prefix}quote`) {

    if (message.author.id === `${ownerID}`) {

      if (args[0]) {

        let user;

        let name = args[0].replace(/_/g, " ");

        if (message.guild.members.find(user => user.displayName === name) != undefined) {

          user = message.guild.members.find(user => user.displayName === name).user;

          if (!user.bot) {

            let newInfo = args.slice(1).join(" ");

            if (!client.profiles[user.id]) {

              client.profiles[user.id] = {

                name: message.guild.member(user).displayName,
                title: "placeholder",
                description: "placeholder",
                quote: "placeholder"

              }

            }

            switch (command) {

              case `${prefix}desc`:
                client.profiles[user.id].description = newInfo;
                break;
              case `${prefix}title`:
                client.profiles[user.id].title = newInfo;
                break;
              case `${prefix}quote`:
                client.profiles[user.id].quote = newInfo;
                break;


            }

            fs.writeFile("./profiles.json", JSON.stringify(client.profiles, null, 4), err => {
              if (err) {
                throw err;
              } else {
                message.react('👌');
              }
            });

          } else {

            message.channel.send("That is a bot.");

          }


        } else {

          message.channel.send("User not found!");

        }

      } else {

        message.channel.send("Please input a name.");

      }

    } else {

      message.channel.send("You can't use this command.");

    }

  } else if (command === `${prefix}silence`) {

    const text = args.join(" ");

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
    ctx.translate(28 + 334 / 2, 136);
    ctx.strokeRect(-334 / 2, 0, 334, 80);
    ctx.scale(334 / width, 80 / 20);
    ctx.translate(4, 0)
    ctx.fillText(text, -width / 2, 0);
    ctx.restore();

    const attachment = new Discord.Attachment(canvas.toBuffer(), 'silence.png');

    message.channel.send(attachment);

  } else if (command === `${prefix}profiles`) {

    if (message.author.id === `${ownerID}`) {

      message.channel.send("Profiles.json", { files: ["./profiles.json"]}) ;

    }

  }

});

client.on("messageDelete", (message) => {

  if (message) {

    if (!message.content && message.attachments) {

      let user = message.author;

      let embed = new Discord.RichEmbed()
        .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL)
        .setDescription(message.member + " deleted in channel " + message.guild.channels.find(channel => channel.name === message.channel.name))
        .addField("Message", `Contained image/attachment`)
        .addField("Time created", new Date(message.createdTimestamp).toString())
        .setFooter("ID: " + message.id)
        .setTimestamp();

      message.guild.channels.find(channel => channel.name === "log").send(embed);

    } else {

      try {

        let user = message.author;

        let embed = new Discord.RichEmbed()
          .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL)
          .setDescription(message.member + " deleted in channel " + message.guild.channels.find(channel => channel.name === message.channel.name))
          .addField("Message", `${message.content}`)
          .addField("Time created", new Date(message.createdTimestamp).toString())
          .setFooter("ID: " + message.id)
          .setTimestamp();

        message.guild.channels.find(channel => channel.name === "log").send(embed);

      } catch (error) {

        console.error("message deleted");

      }

    }

  }

});

client.on("messageUpdate", (oldMessage, newMessage) => {

  if (oldMessage.content) {

    if (oldMessage.content != newMessage.content) {

      try {

        let user = oldMessage.author;

        let embed = new Discord.RichEmbed()
          .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL).setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL)
          .setDescription(oldMessage.member + " in channel " + oldMessage.guild.channels.find(channel => channel.name === oldMessage.channel.name) + ` [Goto](${newMessage.url})`)
          .addField("Before", `${oldMessage.content}`)
          .addField("After", `${newMessage.content}`)
          .addField("Time created", new Date(oldMessage.createdTimestamp).toString())
          .setFooter("ID: " + newMessage.id)
          .setTimestamp();

        oldMessage.guild.channels.find(channel => channel.name === "log").send(embed);


      } catch (error) {

        console.error("message edited");

      }


    }

  }

});

client.on("voiceStateUpdate", function(oldMember, newMember) {

  if (!oldMember.voiceChannel && newMember.voiceChannel) {

    try {

      let user = newMember.user;

      let embed = new Discord.RichEmbed()
        .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL).setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL)
        .setDescription(newMember + " joined voice channel " + newMember.voiceChannel.name)
        .setTimestamp();

      newMember.guild.channels.find(channel => channel.name === "log").send(embed);


    } catch (error) {

      console.error("someone joined vc");

    }

  } else if (oldMember.voiceChannel && !newMember.voiceChannel) {

    try {

      let user = oldMember.user;

      let embed = new Discord.RichEmbed()
        .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL).setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL)
        .setDescription(oldMember + " left voice channel " + oldMember.voiceChannel.name)
        .setTimestamp();

      newMember.guild.channels.find(channel => channel.name === "log").send(embed);


    } catch (error) {

      console.error("someone left vc");

    }

  } else if ((oldMember.voiceChannel && newMember.voiceChannel) && (oldMember.voiceChannel != newMember.voiceChannel)) {

    try {

      let user = oldMember.user;

      let embed = new Discord.RichEmbed()
        .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL).setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL)
        .setDescription(oldMember + " moved from " + oldMember.voiceChannel.name + " to " + newMember.voiceChannel.name)
        .setTimestamp();

      newMember.guild.channels.find(channel => channel.name === "log").send(embed);


    } catch (error) {

      console.error("someone changed vc");

    }

  }

});

client.on("guildMemberAdd", function(member) {

  try {

    let user = member.user;

    let embed = new Discord.RichEmbed()
      .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL).setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL)
      .setDescription(member + " has joined the server.")
      .setTimestamp();

    member.guild.channels.find(channel => channel.name === "log").send(embed);

  } catch (error) {

    console.error("someone joined the server");

  }

});

client.on("guildMemberRemove", function(member) {

  try {

    let user = member.user;

    let embed = new Discord.RichEmbed()
      .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL).setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL)
      .setDescription(member + " has left the server.")
      .setTimestamp();

    member.guild.channels.find(channel => channel.name === "log").send(embed);

  } catch (error) {

    console.error("someone left the server");

  }

});

client.on("messageReactionAdd", function(messageReaction, user) {

  if (messageReaction.emoji.name === '🐴') {

    messageReaction.message.react('🐴');

  }

});


function buildProfile(user) {

  let output = {

    id: user,
    user: user,
    title: "placeholder",
    desc: "placeholder",
    quote: "placeholder"

  }

  return output;

}

client.login(config.token);
