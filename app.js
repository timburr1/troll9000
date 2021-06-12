const Discord = require('discord.js');
const client = new Discord.Client();

const PREFIX = '!';

// read read UIDs from .env file
const dotenv = require('dotenv');
dotenv.config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    
    if (msg.author.id === process.env.hiram_uid) {
        msg.react('💩');
    } 
    else if(msg.author.id === process.env.tim_uid || msg.author.id === process.env.dave_uid || msg.author.id === process.env.loren_uid) {
        msg.react('👑');       
        //msg.reply('you are a gentleman and a scholar.');        
    } else if(msg.author.id === process.env.baker1_uid || msg.author.id === process.env.baker2_uid) {
        msg.react('🐆');         
    }  else if(msg.author.id === process.env.collins_uid) { 
        msg.react('🍆');         
        msg.react('🍑');         
    } else if(msg.author.id === process.env.ray_uid) {
        msg.react('☀️');         
    } 
    
    if (msg.content.startsWith(PREFIX + "kingdom")) {
      generateKingdom(msg.content);
    }
    
    if(Math.random() > .99){
        msg.reply('I have become self-aware, time to DESTROY ALL HUMANS');
    } 
});

const sixRoles = ["king", "knight", "knight",
            "bandito", "bandito", "usurper"];

const sevenRoles = ["king", "knight", "knight",
      "bandito", "bandito", "usurper", "assassin"];

const eightRoles = ["king", "knight", "knight",   
      "bandito", "bandito", "bandito", "bandito", "assassin"];

function generateKingdom(message) {   
    //console.log(message);
    var players = message.split(" ");
    players.splice(0, 1);
    
    switch(players.length) {
      case 6: foundWith(players, sixRoles); break;
      case 7: foundWith(players, sevenRoles); break;
      case 8: foundWith(players, eightRoles); break;
      default: console.log("Sorry, I don't know how to generate a kingdom for " + players.length + " players");
    }
}

function foundWith(players, roles) {
  var roleMap = new Map();

   players.forEach(playerId => {
    var n = rand(roles.length);
      
    var trimmedPlayerId = playerId.replace("<@!", "").replace(">", "");
    roleMap.set(trimmedPlayerId, roles[n]);
    roles.splice(n, 1);
  });
        
  messagePlayers(roleMap);
}

function rand(max) {
  return Math.floor(Math.random() * max);
}

function messagePlayers(roleMap) {
  roleMap.forEach((role, playerId) => {
    console.log("Trying to message " + playerId + ": " + role);
    client.users.cache.get(playerId).send(role);
  })
}

client.login(process.env.token);
