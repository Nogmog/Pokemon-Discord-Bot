require('dotenv').config()

const { Attachment, Message, MessageEmbed, Discord } = require("discord.js");
const Client = require('./Client');
const client = new Client({ intents: [3243773] });
const SQLite = require("better-sqlite3");
const sql = new SQLite("./userData.sqlite");
const getInfo = require("./user.getInfo");

let pokemon = [ "pikachu", "eevee", "charmander", "squirtle" ]
let currentPokemon = null;
let timer = 60;


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setStatus("online");

  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='userData';").get();
  if(!table["count(*)"]) {
    sql.prepare("CREATE TABLE userData (userID INTEGER PRIMARY KEY, coins INTEGER, pokeballs INTEGER, xp INTEGER)").run();
  }
});

client.once('ready', async () => {
    console.log('Ready!');
});

client.on("messageCreate", message => {
  var prefix = '!'
  var msg = message.content;

  if (message.content === "ping"){
    message.reply("Pong!");
  }
  else if (message.content === "pong"){
    message.reply("Ping!");
  }

	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

  if (command === "pokemon" && currentPokemon == null) {
    let selected = Math.floor(Math.random() * pokemon.length);
    currentPokemon = pokemon[selected];
    message.channel.send({ files: ["./pokemon/" + currentPokemon + ".jpg"] });
    message.channel.send("A wild " + currentPokemon + " has spawned! You have " + timer + " seconds to catch it!");
    setTimeout(() => {
      if(currentPokemon != null){
        message.channel.send("The " + currentPokemon + " has ran away!");
      }
    }, timer * 1000);
  }

  if(command === "coins"){
    let user = message.author.id;
    getInfo.getCoins(user, (response) => {
      return message.reply("You have " + response + " coins!");
    })
  }

  if(command === "mysterybox"){
    let user = message.author.id;
    getInfo.addCoins(user, 50, (response) => {
        return message.reply(response);
    })
  }
  
    if (command === "catch"){
      if (!args.length) {
        return message.reply("You didn't provide any arguments!");
      }
      else if (currentPokemon == null){
        return message.reply("No pokemon are available to catch!");
      }
      else if (args[0] == currentPokemon.toLowerCase()) {
        message.reply("You've successfully caught a " + args[0]);
        currentPokemon = null;
      }
      else{
        message.reply("Hmm... That pokemon isn't available to catch (check your spelling)");
      }
    }

});


client.login(process.env.DISCORD_TOKEN);