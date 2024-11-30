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
    
    if (msg.author.id === process.env.tim_uid) {
        msg.react('👑');       
        //msg.reply('you are a gentleman and a scholar.');        
    } /*else {
        msg.react('💩');
    } */
    
    /*
    if(msg.content.startsWith(PREFIX + "santa")) {
      secretSanta();
    } else if (msg.content.startsWith(PREFIX + "test")) {
      client.users.fetch(process.env.tim_uid, false).then((user) => {
        user.send("test");
      });        
    } */

    if(Math.random() > .99){
        msg.reply('I have become self-aware, time to DESTROY ALL HUMANS');
    } 
});

function secretSanta() {
  // These are some ho-ho-hos:
  const dudes = ["Ben", "Collins", "Dave", "Joe", "Kyle", "Mooney", "Ray", "Tim", "Hiram", "Kaiser"];
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
    
  //console.log(santaMap);
  messagePlayers(santaMap);
}

function rand(max) {
  return Math.floor(Math.random() * max);
}

function rot13(input) {
  const originalAlpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const cipher = "nopqrstuvwxyzabcdefghijklmNOPQRSTUVWXYZABCDEFGHIJKLM"

  return input.replace(/[a-z]/gi, letter => cipher[originalAlpha.indexOf(letter)]);
}

function messagePlayers(santaMap) {
  
  const idMap = new Map([
    ["Ben", process.env.ben_uid],
    ["Collins", process.env.collins_uid],
    ["Dave", process.env.dave_uid], 
    ["Joe", process.env.joe_uid], 
    ["Kyle", process.env.kyle_uid], 
    ["Mooney", process.env.mooney_uid], 
    ["Ray", process.env.ray_uid], 
    ["Tim", process.env.tim_uid],
    ["Hiram", process.env.hiram_uid], 
    ["Kaiser", process.env.kaiser_uid]
  ]);

  santaMap.forEach((giver, giftee) => {
    //console.log("Trying to message " + giver + ": " + giftee);
    //console.log("Giver UID: " + idMap.get(giver));    
    client.users.fetch(idMap.get(giver), false).then((user) => {
      user.send("Hello, " + giver + " your secret santa giftee is: " + giftee);
      console.log(rot13(giver + " to " + giftee));    
    });
  }) 
}

client.login(process.env.token);
