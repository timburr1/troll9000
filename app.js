const { Client, GatewayIntentBits, Events, EmbedBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');
const dice = require('./dice');
const scryfall = require('./scryfall');

// MessageContent is a privileged intent: enable it in the developer portal (Bot tab)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = '!';

// read read UIDs from .env file
const dotenv = require('dotenv');
dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll dice, e.g. 2d6+3, d20, 4d6kh3 (keep highest 3), 2d20kl1 (disadvantage)')
    .addStringOption(o => o.setName('dice').setDescription('what to roll').setRequired(true)),
  new SlashCommandBuilder()
    .setName('mtg')
    .setDescription('Look up a Magic card on Scryfall')
    .addStringOption(o => o.setName('card').setDescription('card name (fuzzy)').setRequired(true).setAutocomplete(true))
].map(c => c.toJSON());

client.on(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // a guild registers instantly; global commands can take up to an hour to appear
  try {
    const guild = process.env.GUILD_ID && await client.guilds.fetch(process.env.GUILD_ID);
    await (guild ? guild.commands.set(commands) : client.application.commands.set(commands));
    console.log('Registered ' + commands.length + ' slash commands' + (guild ? ' in ' + guild.name : ' globally'));
  } catch (err) {
    console.log("Couldn't register slash commands: " + err.message);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  try {
    if (interaction.isAutocomplete()) {
      await autocompleteCard(interaction);
    } else if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'roll') await rollCommand(interaction);
      else if (interaction.commandName === 'mtg') await mtgCommand(interaction);
    }
  } catch (err) {
    console.log('Interaction failed: ' + err.message);
  }
});

client.on(Events.MessageCreate, msg => {
    
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

  const dudes = Array.from(msg.mentions.members.values());
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

async function rollCommand(interaction) {
  const expr = interaction.options.getString('dice');
  try {
    const { total, text } = dice.evaluate(expr);
    await interaction.reply('🎲 `' + expr.trim() + '`: ' + text + ' = **' + total + '**');
  } catch (err) {
    await interaction.reply({ content: err.message, flags: MessageFlags.Ephemeral });
  }
}

async function autocompleteCard(interaction) {
  const query = interaction.options.getFocused();
  let names = [];
  // Scryfall wants at least 2 characters; a failed lookup just means an empty list
  if (query.length >= 2) {
    try {
      names = await scryfall.autocomplete(query);
    } catch (err) {
      console.log('Scryfall autocomplete failed: ' + err.message);
    }
  }
  await interaction.respond(names.map(n => ({ name: n.slice(0, 100), value: n.slice(0, 100) })));
}

// one text block per face; a single-face card has just one
function faceText(f, showName) {
  const lines = [];
  lines.push(((showName ? '**' + f.name + '** ' : '') + (f.mana_cost || '')).trim());
  lines.push('*' + f.type_line + '*');
  if (f.oracle_text) lines.push(f.oracle_text);
  // escape the * in power/toughness like */1+* so Discord doesn't read it as italics
  if (f.power !== undefined) lines.push((f.power + '/' + f.toughness).replace(/\*/g, '\\*'));
  if (f.loyalty) lines.push('Loyalty: ' + f.loyalty);
  return lines.filter(l => l.trim()).join('\n');
}

function cardEmbed(card) {
  // double-faced cards keep their text and images on each face
  const faces = card.card_faces && !card.oracle_text ? card.card_faces : [card];
  const description = faces.map(f => faceText(f, faces.length > 1)).join('\n\n');

  const embed = new EmbedBuilder()
    .setTitle(card.name)
    .setURL(card.scryfall_uri)
    .setDescription(description.slice(0, 4000))
    .setFooter({ text: card.set_name + ' · ' + card.rarity });

  const images = card.image_uris || faces[0].image_uris;
  if (images) embed.setThumbnail(images.normal);
  return embed;
}

async function mtgCommand(interaction) {
  const name = interaction.options.getString('card');
  // the Scryfall round trip can exceed Discord's 3 second reply window
  await interaction.deferReply();
  try {
    const card = await scryfall.findCard(name);
    await interaction.editReply({ embeds: [cardEmbed(card)] });
  } catch (err) {
    const msg = err.status === 404 ? err.message : "Scryfall isn't answering, try again in a bit.";
    await interaction.editReply(msg);
  }
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
