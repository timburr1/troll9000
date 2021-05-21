const Discord = require('discord.js');
const client = new Discord.Client();

const dotenv = require('dotenv');
dotenv.config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    //console.log(msg.content);

    //Tim:
    /* if(msg.author.id === process.env.tim_uid) {
        msg.reply('Boomer Sooner!');
    } */  
    
    //Collins:
    if (msg.author.id === process.env.collins_uid) {
        msg.reply(':collins:');
    }   //Dave:
    else if (msg.author.id === process.env.dave_uid) {
        msg.reply(':crown:');
    }   //Hiram:     
    else if (msg.author.id === process.env.hiram_uid) {
        msg.reply(':poop:');
    }   //Kyle: 
    else if (msg.author.id === process.env.kyle_uid) {
        msg.reply(':KYLE:');
    } else if(Math.random() > .999){
        msg.reply('I have become self-aware, time to DESTROY ALL HUMANS');
    } 
});

client.login(process.env.token);