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
    
    if(msg.content.startsWith(PREFIX + "santa")) {
      secretSanta(msg);
    } 

    if(Math.random() > .99){
        msg.reply('I have become self-aware, time to DESTROY ALL HUMANS');
    } 
});

// usage: !santa @Ben @Collins @Dave ...
function secretSanta(msg) {
  if (!msg.guild) {
    msg.reply("run !santa in a server channel, not a DM.");
    return;
  }

  const dudes = msg.mentions.members.array();
  if (dudes.length < 3) {
    msg.reply("mention at least 3 people, e.g. !santa @Ben @Collins @Dave");
    return;
  }
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
  msg.reply("ho ho ho! DMs sent to " + dudes.length + " santas.");
}

function rand(max) {
  return Math.floor(Math.random() * max);
}

function rot13(input) {
  const originalAlpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const cipher = "nopqrstuvwxyzabcdefghijklmNOPQRSTUVWXYZABCDEFGHIJKLM"

  return input.replace(/[a-z]/gi, letter => cipher[originalAlpha.indexOf(letter)]);
}

// santaMap is GuildMember -> GuildMember, so we can DM the giver directly
function messagePlayers(santaMap) {
  santaMap.forEach((giftee, giver) => {
    //console.log("Trying to message " + giver.displayName + ": " + giftee.displayName);
    giver.send("Hello, " + giver.displayName + " your secret santa giftee is: " + giftee.displayName)
      .then(() => console.log(rot13(giver.displayName + " to " + giftee.displayName)))
      .catch((err) => console.log("Couldn't DM " + giver.displayName + ": " + err.message));
  })
}

client.login(process.env.TOKEN);
