require('dotenv').config()

const { Attachment, Message, MessageEmbed, Discord } = require("discord.js");
const Client = require('./Client');
const client = new Client({ intents: [3243773] });
let pokemon = [ "Pikachu", "Eevee", "Charmander", "Squirtle" ]
let currentPokemon = null;
let timer = 60;


client.once('ready', async () => {
    console.log('Ready!');
});

client.on("messageCreate", message => {
  var prefix = '!'
  var msg = message.content;

  if (msg === prefix + 'pokemon') {let selected = Math.floor(Math.random() * pokemon.length);
    currentPokemon = pokemon[selected];
    message.channel.send({ files: ["./pokemon/" + currentPokemon + ".jpg"] });
    message.channel.send("A wild " + currentPokemon + " has spawned! You have " + timer + " seconds to catch it!");

  }
  if (message.content === "ping"){
    message.reply("Pong!");
  }
  else if (message.content === "pong"){
    message.reply("Ping!");
  }
});


client.login(process.env.DISCORD_TOKEN);