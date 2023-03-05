const SQLite = require("better-sqlite3");
const sql = new SQLite("./userData.sqlite");

//gets a random pokemon
const randomPokemon = (done) => {
    const amountOfPokemon = sql.prepare("SELECT count(*) FROM pokemon").get()["count(*)"];
    let selected = Math.floor(Math.random() * amountOfPokemon) + 1;
    
    const selectedPokemon = sql.prepare("SELECT * FROM pokemon WHERE pokemonID=?;").get(selected);
    return done(selectedPokemon);
}

const pokemonInfo = (pokemonID, done) => {
    const statement = sql.prepare("SELECT * FROM pokemon WHERE pokemonID=?").get(pokemonID);
    return done(statement);
}

module.exports = {
    randomPokemon: randomPokemon,
    pokemonInfo: pokemonInfo,
}