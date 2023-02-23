require('dotenv').config()

const { Discord, MessageEmbed } = require("discord.js");
const Client = require('./Client');
const client = new Client({ intents: [3243773] });


client.once('ready', async () => {
    console.log('Ready!');
});


client.on("messageCreate", async message => {
  var prefix = '!'
  var msg = message.content;

  if (msg === prefix + 'pokemon') {
    const embed = new Discord.MessageEmbed()
        .setTitle('Header')
        .setImage('pikachu.jpg')
        .setFooter('Footer');

    // Send the embed as a reply to the message
    message.reply({ embeds: [embed] });
    //const attachment = new MessageAttachment('pikachu.jpg');
    //message.channel.send(`${message.author}, here is your Pikachu!`, attachment);


    //message.channel.send("Here is your pokemon", { files: ["./pikachu.jpg"] });
  }
  if (message.content === "ping"){
    message.reply("Pong!");
  }
  else if (message.content === "pong"){
    message.reply("Ping!");
  }
});


client.login(process.env.DISCORD_TOKEN);