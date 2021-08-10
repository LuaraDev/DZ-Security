const Discord = require("discord.js");
const mysql = require("mysql");
const express = require('express');
let prefix = "!";
let whitelistedids = "id1,id2";
let whitelistedresources = "resourcetype,resourcetype2,resourcetype3";
const app = express();
let bot = new Discord.Client();
var db_config = {
  host     : "localhost",
  user     : "root",
  password : '',
  Database : "security"
};

function print(text){
  console.log(text);
}

var connection;
function reconnect() {
  connection = mysql.createConnection(db_config);
  connection.connect(function(err) {
    if (err) {
      print('Error when connecting to db: '+ err);
      setTimeout(reconnect, 2000);
    }
  });

  connection.on('error', function(err) {
    print('Database error: '+ err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      reconnect();
    } else {
      throw err;
    }
  });
}

reconnect();

app.listen(80,function(){
  print("Website is ready");
})

bot.on("ready",function(){
  print("Bot is ready");
})

function getRandomString(length) {
  var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var result = '';
  for ( var i = 0; i < length; i++ ) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}


bot.on("message", async function(message){
  if (message.author.equals(bot.user)) return;
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (message.channel.type == "dm" || message.guild == null) return;

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0].replace(prefix,"");
  let args = messageArray.slice(1);

  function ErrorEmbed(err)
  {
    const Embed = new Discord.MessageEmbed()
    .addFields({ name: 'Database Error', value: "`" + err + "`", inline: false },)
    .setFooter("©️ All rights reserved by Development-Zone | " + dformat);
    message.channel.send(Embed)
  }

  function Taken()
  {
    const Embed = new Discord.MessageEmbed()
    .addFields({ name: 'License Error - ', value: "This token already taken, try again.", inline: false },)
    .setFooter("©️ All rights reserved by Development-Zone | " + dformat);
    message.channel.send(Embed)
  }    
    
  function Error(msg)
  {
    var d = new Date,
    dformat = [d.getMonth()+1, d.getDate(), d.getFullYear()].join('/')+' '+ [d.getHours(), d.getMinutes(),].join(':');
    const Embed = new Discord.MessageEmbed()
    .addFields({ name: 'License Error - ', value: msg, inline: false },)
    .setFooter("©️ All rights reserved by Development-Zone | " + dformat);
    message.channel.send(Embed)
  }


  if (cmd == "create"){
    if (!whitelistedids.includes(message.author.id)) return;
    if (args[1] && !whitelistedresources.includes(args[1])) return Error("No resource `" + args[1] + "` exits.");
    let ip = args[0];
    let resource = args[1];
    let customer = args[2];
    if (!ip) return Error("Command usage: `"+prefix+"create <ip> <resource>`");
    if (!resource) return Error("Command usage: `"+prefix+"create <ip> <resource>`");
    let code = getRandomString(15)

    connection.query('SELECT * FROM security.tokens WHERE token = ?',[code], function (err,rows){
      if (err) return message.channel.send(ErrorEmbed(err));
      if (rows.length == 0) {
        connection.query("INSERT INTO security.tokens(ip, token, resource, customer) VALUES(?, ?, ?, ?)",[ip, code, resource, customer],function(err){
          if (err) return message.channel.send(ErrorEmbed(err));
        
          var d = new Date,
          dformat = [d.getMonth()+1, d.getDate(), d.getFullYear()].join('/')+' '+ [d.getHours(), d.getMinutes(),].join(':');

          const Embed = new Discord.MessageEmbed()
          .setColor("#3f75e0")
          .addFields({ name: 'Created New License - ', value: "`" + code + "` for resource type: `" + resource + "` (||" + ip + "||)", inline: false },)
          .setFooter("©️ All rights reserved by Development-Zone | " + dformat);
          message.channel.send(Embed)

        })
      } else {
        message.channel.send(Taken());
      }
    })
  }

  if (cmd == "delete"){
    if (!whitelistedids.includes(message.author.id)) return;
    let user = args[0];
    if (!user) return Error("Command usage: `"+prefix+"delete <license>`");

    connection.query("SELECT * FROM security.tokens WHERE token = ?",user,function(err,rows){
      if (err) return message.channel.send(ErrorEmbed(err));
      if (rows.length == 0) return Error("License `" + user + "` cannot be found.");
      else {
        rows.forEach(function (row) {
          let customer = row.customer
          let res = row.resource

          connection.query("DELETE FROM security.tokens WHERE token = ?",[user],function(err, rows){
            var d = new Date,
            dformat = [d.getMonth()+1, d.getDate(), d.getFullYear()].join('/')+' '+ [d.getHours(), d.getMinutes(),].join(':');
            const Embed = new Discord.MessageEmbed()
            .setColor("#3f75e0")
            .addFields({ name: 'Deleted License - ', value: "`" + user + "` that made for `" + customer + "` (`" + res + "`) has been deleted.", inline: false },)
            .setFooter("©️ All rights reserved by Development-Zone | " + dformat);
            message.channel.send(Embed)
          })
        })
      }
    })
  }

  if (cmd == "change"){
    if (!whitelistedids.includes(message.author.id)) return;
    let user = args[0];
    let newtype = args[1];
    if (!newtype) return Error("Command usage: `"+prefix+"change <license> <newResource>`");
    if (!user) return Error("Command usage: `"+prefix+"change <license> <newResource>`");
    
    connection.query("SELECT * FROM security.tokens WHERE token = ?",user,function(err,rows){
      if (err) return message.channel.send(ErrorEmbed(err));
      if (rows.length == 0) return Error("License `" + user + "` cannot be found.");
      else {
        connection.query("UPDATE security.tokens SET resource = ? WHERE token = ?",[newtype, user],function(err){
          if (err) return message.channel.send(ErrorEmbed(err));
          var d = new Date,
          dformat = [d.getMonth()+1, d.getDate(), d.getFullYear()].join('/')+' '+ [d.getHours(), d.getMinutes(),].join(':');
          const Embed = new Discord.MessageEmbed()
          .setColor("#3f75e0")
          .addFields({ name: 'Changed License resource - ', value: "`" + user + "` changed for `" + newtype + "` type.", inline: false },)
          .setFooter("©️ All rights reserved by Development-Zone | " + dformat);
          message.channel.send(Embed)
        })
      }
    })
  }


  if (cmd == "listall"){
    if (!whitelistedids.includes(message.author.id)) return;
    connection.query("SELECT * FROM security.tokens",function(err,rows){
      if (rows.length == 0) return Error("0 Licenses.");
      else {
        const Embed = new Discord.MessageEmbed()
        rows.forEach(function (row) {
          Embed.setColor("#3f75e0")
          Embed.setAuthor("Development-Zone Services")
          Embed.setTitle("Licenses List")
          Embed.addFields({ name: 'Customer', value: "`" + row.customer + "`", inline: true },)
          Embed.addFields({ name: 'License', value: "||`" + row.token + "`||", inline: true },)
          Embed.addFields({ name: 'Resource', value: "`" + row.resource + "`", inline: true },)
          Embed.setFooter("©️ All rights reserved by Development-Zone");
        })    
        message.channel.send(Embed)
      }
    })
  }
});

bot.login("TOKEN");