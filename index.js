require('dotenv').config()

const { Attachment, Message, MessageEmbed, Discord, EmbedBuilder } = require("discord.js");
const Client = require('./Client');
const config = require('./config.json');
const client = new Client({ intents: [3243773] });
const SQLite = require("better-sqlite3");
const sql = new SQLite("./userData.sqlite");
const getInfo = require("./user.getInfo");

let pokemon = [ "pikachu", "eevee", "charmander", "squirtle" ]
let currentPokemon = null;
let pokeballPrice = 50;
let timer = 60;


client.on('ready', () => {
  client.user.setPresence({
      activities: [{ name: config.activity, type: Number(config.activityType) }],
      status: 'online',
  });

  console.log(`Logged in as ${client.user.tag}!`);

  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='userData';").get();
  if(!table["count(*)"]) {
    sql.prepare("CREATE TABLE userData (userID INTEGER PRIMARY KEY, coins INTEGER, pokeballs INTEGER, xp INTEGER)").run();
  }
});

client.once('ready', async () => {
    console.log('Ready!');
});

client.on("messageCreate", message => {
  if (message.content === "ping"){
    return message.reply("Pong!");
  }

  //if message is image from this bot, this is to ensure that text comes after the image
  if (message.attachments.size > 0 && message.author.bot == true){
    message.channel.send("A wild " + currentPokemon + " has spawned! You have " + timer + " seconds, type `!catch {pokemon}` to catch it!");
  }

  //everything below here relates specifcally to commands
  var prefix = '!';
	if (!message.content.startsWith(prefix) || message.author.bot) return;

  let user = message.author.id;
	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
  console.log(message.author.username + " used " + message.content);

  if (command === "pokemon" && currentPokemon == null) {
    let selected = Math.floor(Math.random() * pokemon.length);
    currentPokemon = pokemon[selected];
    message.channel.send({ files: ["./pokemon/" + currentPokemon + ".jpg"] });
    console.log(currentPokemon + " has spawned");
    setTimeout(() => {
      if(currentPokemon != null){
        message.channel.send(currentPokemon + " has ran away!");
        console.log(currentPokemon + " ran away");
        currentPokemon = null;
      }
    }, timer * 1000);
  }

  else if (command === "catch"){
    if (!args.length) {
      return message.reply("You didn't provide any arguments!");
    }
    else if (currentPokemon == null){
      return message.reply("No pokemon are available to catch!");
    }
    else if (getInfo.getPokeballs(user, (response) => {return response}) < 1){
      return message.reply("You have no pokeballs!");
    }
    else if (args[0] == currentPokemon.toLowerCase()) {
      getInfo.setPokeballs(user, -1, (response) => {
        message.channel.send("You've thrown a pokeball!");
        const chance = Math.random();
        console.log("Pokeball thrown: " + chance)
        if (chance < 0.5) {
          console.log(currentPokemon + " was caught");
          getInfo.getPokeballs(user, (result) => {
            message.reply("You've successfully caught " + currentPokemon + "\n`You now have " + result + " pokeballs`");
          })
          return currentPokemon = null;
        }
        else{
          message.channel.send(currentPokemon + " has broken free!")
        }

      })
    }
    else{
      return message.reply("Hmm... That pokemon isn't available to catch (check your spelling)");
    }
  }

  else if(command === "coins"){
    getInfo.getCoins(user, (response) => {
      return message.reply("You have " + response + " coins!");
    })
  }

  else if(command === "pokeballs"){
    getInfo.getPokeballs(user, (response) => {
      return message.reply("You have " + response + " pokeballs!");
    })
  }

  else if(command === "mysterybox"){
    getInfo.setCoins(user, 50, (response) => {
        return message.reply("You've found a mystery box and recieved 50 coins!\nYou now have " + response + " coins.");
    })
  }

  else if(command === "shop"){
    return message.reply("```Pokeball | " + pokeballPrice + " coins```Type `!buy {item}` to purchase.");
  }

  else if (command === "buy"){
    getInfo.getCoins(user, (coins) => {
      if (coins<1){
        return message.reply("You don't have enough coins!");
      }
      else if (!args.length) {
        return message.reply("You didn't provide any arguments!");
      }
      else if (args[0].toLowerCase() === "pokeball" && coins >= pokeballPrice){
        getInfo.setCoins(user, -pokeballPrice, (myCoins) => {
          getInfo.setPokeballs(user, 1, (myPokeballs) => {
            return message.reply("You have bought a pokeball!\n`You now have " + myCoins + " coins and " + myPokeballs + " pokeballs`");
          })
        })
      }
      else{
        return message.reply("You can't buy that!");
      }
    });
  }
  else if(command === "stats"){
    let person = user;
    getInfo.playerData(person, (data) => {
      if(data === "User not found") return message.reply("This user doesn't exist");

      return message.channel.send("**Your stats**\n```Coins: " + data.coins + "\nPokeballs: " + data.pokeballs + "\nXP: " + data.xp + "```");
    })
  }
  
  else if (command === "help"){
    message.reply("```!pokeballs | See how many pokeballs you have``````!catch | Catch the current pokemon``````!shop | See what is avaliable in the shop``````!buy | Buy an item from the shop``````!coins | See how many coins you have```")
  }
/*
  else{
    message.reply("Invalid command, check logs for error");
  }*/
});


client.login(process.env.DISCORD_TOKEN);