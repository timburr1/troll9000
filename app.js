const Discord = require('discord.js');
const client = new Discord.Client();

// read read UIDs from .env file
const dotenv = require('dotenv');
dotenv.config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    console.log(msg.content);

    // replying to Hiram:     
    if (msg.author.id === process.env.hiram_uid) {
        msg.react('💩');
    } else if(msg.author.id === process.env.tim_uid || msg.author.id === process.env.dave_uidc || msg.author.id === process.env.loren_uid) {
        msg.react('👑');       
        //msg.reply('you are a gentleman and a scholar.');        
    }      
    
    if(Math.random() > .999){
        msg.reply('I have become self-aware, time to DESTROY ALL HUMANS');
    } 
});

client.login(process.env.token);