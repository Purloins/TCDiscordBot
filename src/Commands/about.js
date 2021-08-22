const { GoogleSpreadsheet } = require("google-spreadsheet");
const Discord = require('discord.js'); // Calling Discord.js
// Structures and commands
const Command = require('../Structures/Command.js');
const fetch = require("node-fetch");
// Credentials details for Google Auth
const creds = require("../Structures/credentials.json");

module.exports = new Command({
	name: 'about',
	usage: 'about {username}',
	description: 'Displays basic Habbo information of a user.',
	
	// Command code
	async run(message, args) {
		const habbo_username = args[1]; // Set the first argument to the Habbo username
		const option = args[2]; // Sets the second argument to the Points
		try {
			// Fetch data API from Habbo API
			const req_profile = await fetch(`https://www.habbo.com/api/public/users?name=${encodeURIComponent(habbo_username)}`).then(res => res.json());
			// If user profile does not exist, print error
			if (req_profile.error == "not-found" || !req_profile.lastAccessTime) {
				return message.reply('Habbo user cannot be found. Did you mistype their username?')
			}
			// If they just want to find out their points,
			if (option == '-points') {
				const doc = new GoogleSpreadsheet('1ShptIEDkhp3Vjc8RwxUVEqaW3_LvBofzrFxbw-o_qfg'); // Setting the Sheet to take data from
				// Connecting to the sheet using Google Auth
				await doc.useServiceAccountAuth({
					client_email: creds.client_email,
					private_key: creds.private_key,
				});
				// Let's load the document information
				await doc.loadInfo();
				// Load the necessary cells first
				const lookup = doc.sheetsByIndex[1];
				await lookup.loadCells('A1:E9');
				// Set the Habbo Username cell of the Sheet to the specified username
				lookup.getCellByA1('C3').value = habbo_username;
				// Save updated values
				await lookup.saveUpdatedCells();
				
				// Get data based on the Habbo username
				await lookup.loadCells('A1:E9');
				// Pay points
				const collected = lookup.getCellByA1('C4');
				const current = lookup.getCellByA1('C5');
				const claimed = lookup.getCellByA1('C6');
				const eligible = lookup.getCellByA1('C7');
				// Display this data in an embeded message
				const embed = new Discord.MessageEmbed();
				embed.setTitle(`Points Information for ${habbo_username}`)
				.addFields(
					{name: 'Pay Points Collected', value: `${collected.value}`},
					{name: 'Current Pay Points', value: `${current.value}`, inline: true},
					{name: 'Weekly Cap', value: `${claimed.value}`, inline: true},
					{name: 'Month Bonus', value: `${eligible.value}`, inline: true},
				)
				.setThumbnail(`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${habbo_username}`)
                .setFooter(`Data requested by ${message.author.username}`, message.author.avatarURL())
				message.channel.send({ embeds: [embed] });
			} else {
				// Else,
				const req_friends = await fetch(`https://www.habbo.com/api/public/users/${req_profile.uniqueId}/friends`).then(res => res.json());
				var friend_count = Object.keys(req_friends).length;
				var last_login = req_profile.lastAccessTime.slice(0, 10);
				// Create embed with the captured data
				const embed = new Discord.MessageEmbed();
				embed.setTitle(`User Details for ${habbo_username}`)
				.setDescription('・──・──・୨୧・──・──・⁣⁣──')
				.setThumbnail(`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${habbo_username}`)
				.addFields(
					{name: 'Level', value: `${req_profile.currentLevel}, ${req_profile.totalExperience} EXP, (${req_profile.currentLevelCompletePercent}%)\n**${req_profile.starGemCount}**⭐`},
					{name: 'Motto', value: `${req_profile.motto}`},
					{name: 'Last Online Time', value: `${last_login}`},
					{name: 'Number of Friends', value: `${friend_count}`}
				)
				.setFooter(`Data requested by ${message.author.username}`, message.author.avatarURL())
				// Send the embeded message to the channel
				message.reply({ embeds: [embed] });
			}
		} catch(err) {
			console.log(err);
			message.reply('Error encountered. Please ping Purl#0001 with regards to this issue.')
		}
	}
});