const Discord = require('discord.js'); // Calling Discord.js
// Structures and commands
const Command = require('./src/Structures/Command.js');
const config = require('./src/Data/config.json');
// Setting Discord intents and clients
const intents = new Discord.Intents(32767);
const client = new Discord.Client({ intents });

// Successful loaded plugins will be appended into the list
const successfulLoad = [];

// Getting commands from the Commands folder
const fs = require('fs');
client.commands = new Discord.Collection();
fs.readdirSync('./src/Commands').filter(file => file.endsWith('.js')).forEach(file => {
	/**
	* @type {Command}
	*/
	const command = require(`./src/Commands/${file}`);
	client.commands.set(command.name, command);
});

// Return error if message does not start with prefix
client.on('messageCreate', message => {
	if (!message.content.startsWith(config.prefix)) {
		return
	}
	const args = message.content.substring(config.prefix.length).split(/ +/);
	const command = client.commands.find(cmd => cmd.name == args[0]);
	if (!command) {
		return message.reply(`**${args[0]}** is not a valid command.`)
    }
	command.run(message, args, client);
});

// Set Bot Activity
const statusList = ['with Dreams', 'on the Capitol', "with Linda's dog"];
client.on('ready', () => {
	setInterval(() => {
		client.user.setPresence({ activities: [{ name: statusList[Math.floor(Math.random() * statusList.length)] }], status: 'dnd' })
	}, 5000)
});

// Login with the bot's token
client.login(config.token);