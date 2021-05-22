const Discord = require('discord.js');
const client = new Discord.Client();

const dotenv = require('dotenv');
dotenv.config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    //console.log(msg.content);

    //Replying to Tim or Dave:
    if(msg.author.id === process.env.tim_uid || msg.author.id === process.env.dave_uid) {
        msg.react('👑');       
        msg.reply('you are a gentleman and a scholar.');        
    }    //Hiram:     
    else if (msg.author.id === process.env.hiram_uid) {
        msg.react('💩');
    } else if(Math.random() > .999){
        msg.reply('I have become self-aware, time to DESTROY ALL HUMANS');
    } 
});

client.login(process.env.token);