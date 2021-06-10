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
    //console.log(msg.content);

    // replying to Hiram:     
    if (msg.author.id === process.env.hiram_uid) {
        msg.react('💩');
    } //replying to Tim, Dave, or Loren: 
    else if(msg.author.id === process.env.tim_uid || msg.author.id === process.env.dave_uid || msg.author.id === process.env.loren_uid) {
        msg.react('👑');       
        //msg.reply('you are a gentleman and a scholar.');        
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

    console.log(players);

    players.forEach(p => {
      var n = rand(roles.length);
      
      var thisPlayerId = p.replace("<", "").replace(">", "").replace("@", "");
      console.log(thisPlayerId);
      roleMap.set(thisPlayerId, roles[n]);
      roles.splice(n, 1);
    });
        
    messagePlayers(roleMap);
}

function rand(max) {
  return Math.floor(Math.random() * max);
}

function messagePlayers(roleMap) {

  roleMap.forEach((playerId, role) => {
    client.fetch(playerId).then((user) =>{
      user.send(role);
    })
  })
}

client.login(process.env.token);
