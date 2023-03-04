const SQLite = require("better-sqlite3");
const sql = new SQLite("./userData.sqlite");

//sets users pokeballs
const randomPokemon = (done) => {
    const amountOfPokemon = sql.prepare("SELECT count(*) FROM pokemon").get()["count(*)"];
    let selected = Math.floor(Math.random() * amountOfPokemon) + 1;
    
    const selectedPokemon = sql.prepare("SELECT * FROM pokemon WHERE pokemonID=?;").get(selected);
    return done(selectedPokemon);
}

module.exports = {
    randomPokemon: randomPokemon,
}