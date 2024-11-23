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
    
    if (msg.author.id === process.env.mooney_uid) {
        msg.react('💩');
    } 
    else if(msg.author.id === process.env.tim_uid) {
        msg.react('👑');       
        //msg.reply('you are a gentleman and a scholar.');        
    } 
    
    if (msg.content.startsWith(PREFIX + "kingdom")) {
      generateKingdom(msg.content);
    } else if(msg.content.startsWith(PREFIX + "santa")) {
      secretSanta();
    }

    if(Math.random() > .99){
        msg.reply('I have become self-aware, time to DESTROY ALL HUMANS');
    } 
});

const fiveRoles = ["king", "knight", "bandito", "bandito", "assassin"];

const sixRoles = ["king", "knight", "knight", "bandito", "bandito", "usurper"];

const sevenRoles = ["king", "knight", "knight", "bandito", "bandito", "usurper", "assassin"];

const eightRoles = ["king", "knight", "knight", "bandito", "bandito", "bandito", "bandito", "assassin"];

function generateKingdom(message) {   
    //console.log(message);
    var players = message.split(" ");
    players.splice(0, 1);
    
    switch(players.length) {
      case 5: foundWith(players, fiveRoles); break;
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

function secretSanta() {
  // These are some ho-ho-hos:
  const dudes = ["Ben", "Dave", "Joe", "Kyle", "Mooney", "Ray", "Tim"];
  var santaMap = new Map();
  var taken = new Set();

  dudes.forEach(giver => {
    var n = rand(dudes.length);
    
    while(dudes[n] == giver || taken.has(dudes[n])) {
      n = rand(dudes.length);
    }

    var giftee = dudes[n];
    santaMap.set(giver, giftee);
    taken.add(giftee);
  })
    
  console.log(santaMap);
  //messagePlayers(santaMap);
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
