require('dotenv').config()

const { Attachment, Message, MessageEmbed, Discord, EmbedBuilder } = require("discord.js");
const Client = require('./Client');
const config = require('./config.json');
const client = new Client({ intents: [3243773] });
const SQLite = require("better-sqlite3");
const sql = new SQLite("./userData.sqlite");

const userInfo = require("./user.getInfo");
const pokemonInfo = require("./pokemon.getInfo");
const boxInfo = require("./box.getInfo");


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
    console.log("Creating userData table..");
    sql.prepare("CREATE TABLE userData (userID INTEGER PRIMARY KEY, coins INTEGER, pokeballs INTEGER, xp INTEGER, buddyID INTEGER, FOREIGN KEY(buddyID) REFERENCES userBox(boxID))").run();
  }

  const shopTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='shop';").get();
  if(!shopTable["count(*)"]) {
    console.log("Creating shop table..");
    sql.prepare("CREATE TABLE shop (itemID INTEGER PRIMARY KEY, name STRING, price INTEGER, description STRING)").run();
    
    sql.prepare("INSERT INTO shop (name, price, description) VALUES (?, ?, ?);").run("Pokeball", 50, "A simple Pokeball used to catch pokemon.");
    sql.prepare("INSERT INTO shop (name, price, description) VALUES (?, ?, ?);").run("Potion", 50, "Restores 20HP to a pokemon.");
    sql.prepare("INSERT INTO shop (name, price, description) VALUES (?, ?, ?);").run("Super Potion", 100, "Restores 60HP to a pokemon.");
    sql.prepare("INSERT INTO shop (name, price, description) VALUES (?, ?, ?);").run("Hyper Potion", 150, "Restores 120HP to a pokemon.");
    sql.prepare("INSERT INTO shop (name, price, description) VALUES (?, ?, ?);").run("Max Potion", 250, "Restores a pokemon's HP to maximum.");
    sql.prepare("INSERT INTO shop (name, price, description) VALUES (?, ?, ?);").run("Revive", 300, "Revives a pokemon and restores half of it's health.");
    sql.prepare("INSERT INTO shop (name, price, description) VALUES (?, ?, ?);").run("Fire Stone", 1000, "Causes Eevee to evolve into Flareon.");
    sql.prepare("INSERT INTO shop (name, price, description) VALUES (?, ?, ?);").run("Water Stone", 1000, "Causes Eevee to evolve into Vaporeon.");
    sql.prepare("INSERT INTO shop (name, price, description) VALUES (?, ?, ?);").run("Thunder Stone", 1000, "Causes Eevee to evolve into Jolteon.");
    sql.prepare("INSERT INTO shop (name, price, description) VALUES (?, ?, ?);").run("Leaf Stone", 1000, "Causes Eevee to evolve into Leafeon.");
    sql.prepare("INSERT INTO shop (name, price, description) VALUES (?, ?, ?);").run("Ice Stone", 1000, "Causes Eevee to evolve into Glaceon.");
    sql.prepare("INSERT INTO shop (name, price, description) VALUES (?, ?, ?);").run("Night Stone", 1000, "Causes Eevee to evolve into Umbreon.");
    sql.prepare("INSERT INTO shop (name, price, description) VALUES (?, ?, ?);").run("Day Stone", 1000, "Causes Eevee to evolve into Espeon.");
    sql.prepare("INSERT INTO shop (name, price, description) VALUES (?, ?, ?);").run("Fairy Stone", 1000, "Causes Eevee to evolve into Slyveon.");
  }


  const pokemonSQL = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='pokemon';").get();
  if(!pokemonSQL["count(*)"]){
    console.log("Creating pokemon table..");
    sql.prepare("CREATE TABLE pokemon (pokemonID INTEGER PRIMARY KEY, name STRING, rarity INTEGER, maxHealth INTEGER, imgName STRING, type STRING, evolveLevel INTEGER, CatchRate INTEGER, AttackNoEffect INTEGER, AttackSuper INTEGER, AttackNotVery INTEGER)").run();

    // adds all the pokemon - TBD
    sql.prepare("INSERT INTO pokemon (name, rarity, maxHealth, imgName, type) VALUES (?, ?, ?, ?, ?);").run("Pikachu", 1, 100, "pikachu.jpg", "electric");
    sql.prepare("INSERT INTO pokemon (name, rarity, maxHealth, imgName) VALUES (?, ?, ?, ?);").run("Eevee", 1, 100, "eevee.jpg");
    sql.prepare("INSERT INTO pokemon (name, rarity, maxHealth, imgName) VALUES (?, ?, ?, ?);").run("Charmander", 1, 150, "charmander.jpg");
    sql.prepare("INSERT INTO pokemon (name, rarity, maxHealth, imgName) VALUES (?, ?, ?, ?);").run("Squirtle", 1, 200, "squirtle.jpg");
  }

  const userBox = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='userBox';").get();
  if(!userBox["count(*)"]){
    console.log("Creating userBox table..");
    sql.prepare("CREATE TABLE userBox (boxID INTEGER PRIMARY KEY, userID INTEGER, pokemonID INTEGER, health INTEGER, maxHealth INTEGER, level INTEGER, xp INTEGER, FOREIGN KEY(userID) REFERENCES userData(userID), FOREIGN KEY(pokemonID) REFERENCES pokemon(pokemonID))").run();
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
    message.channel.send("A wild " + currentPokemon.name + " has spawned! You have " + timer + " seconds, type `!catch {pokemon}` to catch it!");
  }

  //everything below here relates specifcally to commands
  var prefix = '!';
	if (!message.content.startsWith(prefix) || message.author.bot) return;

  let user = message.author.id;
	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
  console.log(message.author.username + " used " + message.content);

  if (command === "pokemon" && currentPokemon == null) {
    pokemonInfo.randomPokemon((item) => {
      currentPokemon = item;
      message.channel.send({ files: ["./pokemon/" + currentPokemon.imgName] });
    })
    setTimeout(() => {
      if(currentPokemon != null){
        message.channel.send(currentPokemon.name + " has ran away!");
        console.log(currentPokemon.name + " ran away");
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
    else if (userInfo.getPokeballs(user, (response) => {return response}) < 1){
      return message.reply("You have no pokeballs!");
    }
    else if (args[0] == currentPokemon.name.toLowerCase()) {
      userInfo.setPokeballs(user, -1, (response) => {
        message.channel.send("You've thrown a pokeball!");
        const chance = Math.random();
        console.log("Pokeball thrown: " + chance)
        if (chance < 0.5) {
          boxInfo.addPokemon(currentPokemon, user);
          console.log(currentPokemon.name + " was caught");

          userInfo.getPokeballs(user, (result) => {
            message.reply("You've successfully caught " + currentPokemon.name + "\n`You now have " + result + " pokeballs`");
          })
          
          return currentPokemon = null;
        }
        else{
          message.channel.send(currentPokemon.name + " has broken free!")
        }

      })
    }
    else{
      return message.reply("Hmm... That pokemon isn't available to catch (check your spelling)");
    }
  }

  else if(command === "box"){
    boxInfo.allPokemonForUser(user, (response) => {
      if(response === undefined){
        return message.reply("You currently haven't caught any pokemon!");
      }
      let msg = "**__Caught pokemon:__**\n";
      let num = 0
      response.forEach((i) => {
        pokemonInfo.pokemonInfo(i.pokemonID, (data) => {
          num += 1;
          msg += num+". " + data.name + ": HP:" + i.health + "/" + i.maxHealth + ", level " + i.level + "\n";
        })
      })

      return message.reply(msg);
    })
  }

  else if(command === "setbuddy"){
    if (args[0] === null){
      return message.reply("You need to choose a number to pick from the box")
    }
    else{
      boxInfo.allPokemonForUser(user, (response) => {
        try{
          let userChoice = args[0] - 1
          userInfo.setBuddy(user, response[userChoice].boxID, (res) => {
            return message.reply("Buddy successfully set");
          })
        }
        catch(error) {
          return message.reply("Buddy not found")
        }
        // let num = 0;
        // response.forEach((i) => {
        //   num++;
        //   if(num == args[0]){
        //     userInfo.setBuddy(i.userID, i.boxID, (res) => {
        //       return message.reply("Buddy successfully set")
        //     })
        //   }
        // })
        // if(num != args[0]){
        //   return message.reply("Buddy was not found")
        // }
      })
    }
  }

  else if(command === "mysterybox"){
    userInfo.setCoins(user, 50, (response) => {
        return message.reply("You've found a mystery box and recieved 50 coins!\nYou now have " + response + " coins.");
    })
  }

  else if(command === "shop"){
    return message.reply("```Pokeball | " + pokeballPrice + " coins```Type `!buy {item}` to purchase.");
  }

  else if (command === "buy"){
    userInfo.getCoins(user, (coins) => {
      if (coins<1){
        return message.reply("You don't have enough coins!");
      }
      else if (!args.length) {
        return message.reply("You didn't provide any arguments!");
      }
      else if(args[0].toLowerCase() === "pokeball" && args[1] == parseInt(args[1])){ // buy multiple pokeballs
        let buyAmount = parseInt(args[1]);
        if(coins >= pokeballPrice * buyAmount){
          userInfo.setCoins(user, -pokeballPrice * buyAmount, (myCoins) => {
            userInfo.setPokeballs(user, buyAmount, (myPokeballs) => {
              return message.reply("You have bought " + buyAmount + " pokeballs!\n`You now have " + myCoins + " coins and " + myPokeballs + " pokeballs`");
            })
          })
        }else{
          return message.reply("You don't have enough coins!");
        }
      }
      else if (args[0].toLowerCase() === "pokeball" && coins >= pokeballPrice){
        userInfo.setCoins(user, -pokeballPrice, (myCoins) => {
          userInfo.setPokeballs(user, 1, (myPokeballs) => {
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
    if(message.mentions.users.first() && args[0] !== null){
      person = args[0].slice(2, -1);
      if(!client.users.cache.get(person)){
        return message.reply("To find someones stats you need to mention them");
      }
    }

    userInfo.playerData(person, (data) => {
      if(data === "User not found") return message.reply("This user doesn't exist");

      return message.channel.send("**" + client.users.cache.get(person).username + "'s stats**\n```Coins: " + data.coins + "\nPokeballs: " + data.pokeballs + "\nXP: " + data.xp + "```");
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