const SQLite = require("better-sqlite3");
const sql = new SQLite("./userData.sqlite");


function createUser(userID){
    const statement = sql.prepare("INSERT INTO userData (userID, coins, pokeballs, xp) VALUES (?, ?, ?, ?);");
    statement.run(userID, 100, 5, 0);
    console.log("User created");
};

// gives all data on a user
const playerData = (userID, done) => {
    const statement = sql.prepare("SELECT * FROM userData WHERE userID=?;");
    let user = statement.get(userID);
    if(user === undefined){
        return done("User not found");
    }
    return done(user);
}

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

// sets specific amount of coins to a specific user
const setCoins = (userID, amount, done) => {
    const getCoin = sql.prepare("SELECT coins FROM userData WHERE userID=?")
    const setCoins = sql.prepare("UPDATE userData SET coins=? WHERE userID=?");

    let userCoins = getCoin.get(userID)
    if(userCoins === undefined){
        createUser(userID);
        userCoins = getCoin.get(userID);
    }
    setCoins.run(userCoins.coins + amount, userID);
    return done(userCoins.coins + amount);
}

//returns users pokeballs
const getPokeballs = (userID, done) => {
    const statement = sql.prepare("SELECT pokeballs FROM userData WHERE userID=?")
    let pokeballs = statement.get(userID);
    if(pokeballs === undefined){
        createUser(userID); 
        pokeballs = statement.get(userID);
    }
    return done(pokeballs.pokeballs);
}

//sets users pokeballs
const setPokeballs = (userID, amount, done) => {
    const getPokeballs = sql.prepare("SELECT pokeballs FROM userData WHERE userID=?");
    const setPokeballs = sql.prepare("UPDATE userData SET pokeballs=? WHERE userID=?");

    let userPokeballs = getPokeballs.get(userID)
    if(userPokeballs === undefined){
        createUser(userID);
        userPokeballs = getPokeballs.get(userID);
    }
    setPokeballs.run(userPokeballs.pokeballs + amount, userID);
    return done(userPokeballs.pokeballs + amount);
}

const setBuddy = (userID, buddy, done) => {
    console.log(userID, buddy);
    const setBud = sql.prepare("UPDATE userData SET buddyID=? WHERE userID=?");
    setBud.run(buddy, userID);
    return done(null);
}

const gainXP = (userID, amount, done) => {
    const updateXP = sql.prepare("UPDATE userData SET xp=? WHERE userID=?;");
    const getXP = sql.prepare("SELECT xp FROM userData WHERE userID=?;");

    let userXP = getXP.get(userID);
    let newXP = userXP.xp + amount;

    updateXP.run(newXP, userID);
    
    return done(true);
}

module.exports = {
    playerData: playerData, 
    getCoins: getCoins,
    setCoins: setCoins,
    getPokeballs: getPokeballs,
    setPokeballs : setPokeballs,
    setBuddy: setBuddy,
    gainXP: gainXP
}