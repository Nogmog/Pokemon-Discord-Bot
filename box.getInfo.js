const SQLite = require("better-sqlite3");
const sql = new SQLite("./userData.sqlite");

//gets all pokemon for a user
const allPokemonForUser = (userID, done) => {
    const statement = sql.prepare("SELECT * FROM userBox WHERE userID=?;").get(userID);
    return done();
}

//adds a pokemon into the userbox
//pokemon variable must be a single row from pokemon db
const addPokemon = (pokemon, userID, done) => {
    const statement = sql.prepare("INSERT INTO userBox (userID, pokemonID, health, maxHealth, level, XP) VALUES (?, ?, ?, ?, ?, ?);");
    statement.run(userID, pokemon.pokemonID, pokemon.maxHealth, pokemon.maxHealth, 1, 0);
}

module.exports = {
    allPokemonForUser: allPokemonForUser,
    addPokemon: addPokemon
}