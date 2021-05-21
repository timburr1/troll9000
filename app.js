const Discord = require('discord.js');
const client = new Discord.Client();

const dotenv = require('dotenv');
dotenv.config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    console.log(message.content);
    
    //Tim:
    if(msg.author.id === process.env.tim_uid) {
        msg.reply('Boomer Sooner!');
    }   //Hiram: 
    else if (msg.author.id === process.env.hiram_uid) {
        msg.reply(':poop:');
    }   //Ping-pong: 
    else if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
});

client.login(process.env.token);