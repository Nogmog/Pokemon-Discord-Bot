const { Discord } = require("discord.js");
const Client = require('./Client');
const client = new Client({ intents: [3243773] });


client.once('ready', async () => {
    console.log('Ready!');
});


client.on("messageCreate", async message => {
    if (message.content === "ping"){
      message.reply("Pong!");
    }
    else if (message.content === "pong"){
      message.reply("Ping!");
    }
});


client.login("MTA3MzU3OTk5MjAxOTExMjA3Nw.GJEZjw.xTQW_BVMFl8nOKw-JqdJfO0_0CcZtddsl8SifA");