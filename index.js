

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
    sql.prepare("CREATE TABLE userData (userID INTEGER PRIMARY KEY, coins INTEGER, pokeballs INTEGER, xp INTEGER, level INTEGER, buddyID INTEGER, FOREIGN KEY(buddyID) REFERENCES userBox(boxID))").run();
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


  const pokemonSQL = sql.prepare("SELECT count() FROM sqlite_master WHERE type='table' AND name='pokemon';").get();
  if(!pokemonSQL["count()"]){
    console.log("Creating pokemon table..");
    sql.prepare("CREATE TABLE pokemon (pokemonID INTEGER PRIMARY KEY, name STRING, rarity String, maxHealth INTEGER, imgName STRING, type STRING, evolveLevel INTEGER, CatchRate INTEGER, AttackNotVery INTEGER, AttackNoEffect INTEGER, AttackSuper INTEGER)").run();

    // adds all the pokemon - TBD
  sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(1, "Charmander", "Common", 282, "charmander.jpg", "Fire", 16, 47, 52, 98, 223);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(2, "Charmeleon", "Rare", 320, "charmeleon.jpg", "Fire", 36, 24, 64, 119, 249);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(3, "Charizard", "Super Rare", 360, "charizard.jpg", "Fire", null, 12, 84, 155, 293);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(4, "Bulbasaur", "Common", 294, "bulbasaur.jpg", "Grass", 16, 47, 49, 92, 216);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(5, "Ivysaur", "Rare", 324, "ivysaur.jpg", "Grass", 32, 24, 62, 116, 245);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(6, "Venasaur", "Super Rare", 364, "venusaur.jpg", "Grass", null, 12, 82, 152, 289);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(7, "Squirtle", "Common", 292, "squirtle.jpg", "Water", 16, 47, 48, 90, 214);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(8, "Wartotle", "Rare", 322, "wartortle.jpg", "Water", 36, 24, 63, 117, 247);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(9, "Blastoise", "Super Rare", 362, "blastoise.jpg", "Water", null, 12, 83, 153, 291);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(10, "Turtwig", "Common", 314, "turtwig.jpg", "Grass", 18, 47, 68, 126, 258);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(11, "Grotle", "Rare", 354, "grotle.jpg", "Grass", 32, 24, 89, 164, 304);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(12, "Torterra", "Super Rare", 394, "torterra.jpg", "Grass", null, 12, 109, 200, 348);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(13, "Chimchar", "Common", 292, "chimchar.jpg", "Fire", 14, 47, 58, 108, 236);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(14, "Monferno", "Rare", 332, "monferno.jpg", "Fire", 36, 24, 78, 144, 280);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(15, "Infernape", "Super Rare", 356, "infernape.jpg", "Fire", null, 12, 104, 191, 337);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(16, "Piplup", "Common", 310, "piplup.jpg", "Water", 16, 47, 51, 96, 221);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(17, "Prinpulp", "Rare", 332, "prinplup.jpg", "Water", 36, 24, 66, 123, 254);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(18, "Empoleon", "Super Rare", 372, "empoleon.jpg", "Water",  null, 12, 86, 159, 298);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(19, "Rattata", "Common", 264, "rattata.jpg", "Normal", 20, 67, 56, 105, 232);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(20, "Raticate", "Rare", 314, "raticate.jpg", "Normal", null, 33, 81, 150, 287);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(21, "Abra", "Common", 254, "abra.jpg", "Psychic", 16, 52, 20, 105, 152);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(22, "Kadabra", "Rare", 284, "kadabra.jpg", "Psychic", 36, 26, 35, 120, 185);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(23, "Alakazam", "Super Rare", 314, "alakazam.jpg", "Psychic", null, 13, 50, 135, 218);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(24, "Mew", "Super Rare", 404, "mew.jpg", "Psychic", null, 12, 100, 184, 328);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(25, "Mewtwo", "Super Rare", 416, "mewtwo.jpg", "Psychic", null, 1, 110, 202, 350);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(26, "Vulpix", "Common", 280, "vulpix.jpg", "Fire", 28, 50, 41, 78, 199);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(27, "Ninetails", "Rare", 350, "ninetales.jpg", "Fire", null, 20, 76, 141, 276);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(28, "Hisuian Zorua", "Rare", 274, "HisuianZorua.jpg", "Ghost", 30, 20, 60, 112, 240);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(29, "Hisuian Zoroark", "Super Rare", 324, "HisuianZoroark.jpg", "Ghost", null, 12, 105, 193, 339);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(30, "Mimikyu", "Super Rare", 314, "mimikyu.jpg", "Ghost", null, 12, 90, 166, 306);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(31, "Gastly", "Common", 264, "gastly.jpg", "Ghost", 25, 50, 35, 100, 185);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(32, "Haunter", "Rare", 294, "haunter.jpg", "Ghost", 36, 24, 50, 115, 218);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(33, "Gengar", "Super Rare", 324, "gengar.jpg", "Ghost", null, 12, 65, 130, 251);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(34, "Pichu", "Common", 244, "pichu.jpg", "Electric", 14, 50, 40, 76, 196);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(35, "Pikachu", "Common", 274, "pikachu.jpg", "Electric", 32, 50, 55, 103, 229);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(36, "Raichu", "Rare", 324, "raichu.jpg", "Electric", null, 20, 90, 166, 306);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(37, "Igglybuff", "Common", 384, "igglybuff.jpg", "Normal", 16, 44, 30, 58, 174);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(38, "Jigglypuff", "Common", 434, "jigglypuff.jpg", "Normal", 36, 44, 45, 85, 207);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(39, "Wigglytuff", "Super Rare", 484, "wigglytuff.jpg", "Normal", null, 13, 70, 130, 262);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(40, "Dratini", "Common", 286, "dratini.jpg", "Dragon", 30, 47, 64, 119, 249);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(41, "Dragonair", "Rare", 326, "dragonair.jpg", "Dragon", 55, 24, 84, 155, 293);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(42, "Dragonite", "Super Rare", 386, "dragonite.jpg", "Dragon", null, 12, 134, 245, 403);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(43, "Togepi", "Common", 274, "togepi.jpg", "Fairy", 16, 50, 20, 40, 152);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(44, "Togetic", "Rare", 314, "togetic.jpg", "Fairy", 32, 20, 40, 80, 196);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(45, "Togekiss", "Super Rare", 374, "togekiss.jpg", "Fairy", null, 8, 50, 120, 218);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(46, "Rowlet", "Common", 340, "rowlet.jpg", "Grass", 17, 47, 55, 103, 229);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(47, "Dartrix", "Rare", 360, "dartrix.jpg", "Grass", 34, 24, 75, 139, 273);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(48, "Decidueye", "Super Rare", 360, "decidueye.jpg", "Grass", null, 12, 107, 197, 344);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(49, "Litten", "Common", 294, "litten.jpg", "Fire", 17, 47, 65, 121, 251);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(50, "Torracat", "Rare", 334, "torracat.jpg", "Fire", 34, 24, 85, 157, 295);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(51, "Incineroar", "Super Rare", 394, "incineroar.jpg", "Fire", null, 12, 115, 211, 361);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(52, "Popplio", "Common", 304, "popplio.jpg", "Water", 17, 47, 54, 101, 227);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(53, "Brionne", "Rare", 324, "brionne.jpg", "Water", 34, 24, 69, 128, 260);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(54, "Primarina", "Super Rare", 364, "primarina.jpg", "Water", null, 12, 74, 137, 271);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(55, "Shinx", "Common", 294, "shinx.jpg", "Electric", 15, 61, 65, 121, 251);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(56, "Luxio", "Rare", 324, "luxio.jpg", "Electric", 30, 31, 85, 157, 295);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(57, "Luxray", "Super Rare", 364, "luxray.jpg", "Electric", null, 12, 120, 220, 372);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(58, "Zubat", "Common", 284, "zubat.jpg", "Poison", 22, 67, 45, 85, 207);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(59, "Golbat", "Rare", 354, "golbat.jpg", "Poison", 36, 24, 80, 148, 284);
	sql.prepare("INSERT INTO pokemon (pokemonID, name, rarity, maxHealth, imgName, type, evolveLevel, CatchRate, AttackNotVery, AttackNoEffect, AttackSuper) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);").run(60, "Crobat", "Rare", 374, "crobat.jpg", "Poison", null, 24, 90, 166, 306);
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
    else if (args[0].toLowerCase() == currentPokemon.name.toLowerCase()) {
      userInfo.setPokeballs(user, -1, (response) => {
        message.channel.send("You've thrown a pokeball!");
        const chance = Math.random();
        console.log("Pokeball thrown: " + chance)
        if (chance < (currentPokemon.CatchRate / 100)) {
          boxInfo.addPokemon(currentPokemon, user);
          console.log(currentPokemon.name + " was caught");

          userInfo.getPokeballs(user, (result) => {
            userInfo.gainXP(user, 10, (resultXP) => {
              message.reply("You've successfully caught " + currentPokemon.name + "\n`You now have " + result + " pokeballs \nYou have gained 10XP`");
            })
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
    let person = null;
    if(message.mentions.users.first() && args[0] !== null){
      person = args[0].slice(2, -1);
      if(!client.users.cache.get(person)){
        return message.reply("To find someones stats you need to mention them");
      }
    }else{
      person = user;
    }
    boxInfo.allPokemonForUser(person, (response) => {
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

      return message.channel.send("**" + client.users.cache.get(person).username + "'s stats**\n```Coins: " + data.coins + "\nPokeballs: " + data.pokeballs + " \nLevel: " + data.level + "\nXP: " + data.xp + "```");
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