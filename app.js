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
    
    if (msg.author.id === process.env.TIM_UID) {
        msg.react('👑');       
        //msg.reply('you are a gentleman and a scholar.');        
    } /*else {
        msg.react('💩');
    } */
    
    /*
    if(msg.content.startsWith(PREFIX + "santa")) {
      secretSanta();
    } else if (msg.content.startsWith(PREFIX + "test")) {
      client.users.fetch(process.env.TIM_UID, false).then((user) => {
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

  // shuffle, then everyone gives to the next person in the circle
  var shuffled = dudes.slice();
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = rand(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  shuffled.forEach((giver, i) => {
    santaMap.set(giver, shuffled[(i + 1) % shuffled.length]);
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
    ["Ben", process.env.BEN_UID],
    ["Collins", process.env.COLLINS_UID],
    ["Dave", process.env.DAVE_UID], 
    ["Joe", process.env.JOE_UID], 
    ["Kyle", process.env.KYLE_UID], 
    ["Mooney", process.env.MOONEY_UID], 
    ["Ray", process.env.RAY_UID], 
    ["Tim", process.env.TIM_UID],
    ["Hiram", process.env.HIRAM_UID], 
    ["Kaiser", process.env.KAISER_UID]
  ]);

  santaMap.forEach((giftee, giver) => {
    //console.log("Trying to message " + giver + ": " + giftee);
    //console.log("Giver UID: " + idMap.get(giver));    
    client.users.fetch(idMap.get(giver), false).then((user) => {
      user.send("Hello, " + giver + " your secret santa giftee is: " + giftee);
      console.log(rot13(giver + " to " + giftee));    
    });
  }) 
}

client.login(process.env.TOKEN);
