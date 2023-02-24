require('dotenv').config()

const { Attachment, Message, MessageEmbed, Discord } = require("discord.js");
const Client = require('./Client');
const client = new Client({ intents: [3243773] });
let pokemon = [ "./pokemon/pikachu.jpg", "./pokemon/eevee.jpg", "./pokemon/charmander.jpg", "./pokemon/squirtle.jpg" ]


client.once('ready', async () => {
    console.log('Ready!');
});

client.on("messageCreate", message => {
  var prefix = '!'
  var msg = message.content;

  if (msg === prefix + 'pokemon') {let selected = Math.floor(Math.random() * pokemon.length);
    message.channel.send( /*pokemon[selected]*/{files: [pokemon[selected]] });

  }
  if (message.content === "ping"){
    message.reply("Pong!");
  }
  else if (message.content === "pong"){
    message.reply("Ping!");
  }
});


client.login(process.env.DISCORD_TOKEN);