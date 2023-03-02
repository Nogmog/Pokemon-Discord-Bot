const SQLite = require("better-sqlite3");
const sql = new SQLite("./userData.sqlite");


function createUser(userID){
    const statement = sql.prepare("INSERT INTO userData (userID, coins, pokeballs, xp) VALUES (?, ?, ?, ?);");
    statement.run(userID, 0, 0, 0);
    console.log("User created");
};

// goes into db to get a specific users amount of coins
const getCoins = (userID, done) => {
    const statement = sql.prepare("SELECT coins FROM userData WHERE userID=?")
    let coins = statement.get(userID);
    if(coins === undefined){
        createUser(userID); 
        coins = statement.get(userID);
    }
    return done(coins.coins);
}

// adds a specific amount of coins to a specific user
const addCoins = (userID, amount, done) => {
    const getCoin = sql.prepare("SELECT coins FROM userData WHERE userID=?")
    const setCoins = sql.prepare("UPDATE userData SET coins=? WHERE userID=?");

    let userCoins = getCoin.get(userID)
    if(userCoins === undefined){
        createUser(userID);
        userCoins = getCoin.get(userID);
    }
    setCoins.run(userCoins.coins + amount, userID);
    return done("You gained " + amount + " coins!");
}

module.exports = {
    getCoins: getCoins,
    addCoins: addCoins
}