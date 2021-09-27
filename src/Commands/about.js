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
				const msg = await message.reply(`Fetching data... (**This may take a couple of seconds!**)`);
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
				await lookup.loadCells('A1:F12');
				// Set the Habbo Username cell of the Sheet to the specified username
				lookup.getCellByA1('C3').value = habbo_username;
				// Save updated values
				await lookup.saveUpdatedCells();
				// Get data based on the Habbo username
				await lookup.loadCells('A1:F12');
				// Pay points
				const collected = lookup.getCellByA1('C4');
				const current = lookup.getCellByA1('C5');
				const claimed = lookup.getCellByA1('C6');
				const eligible = lookup.getCellByA1('C7');
				const vouchers = lookup.getCellByA1('C8');
				const weekly = lookup.getCellByA1('C9');
				const reduction = lookup.getCellByA1('C10');
				// Display this data in an embeded message
				const embed = new Discord.MessageEmbed();
				embed.setTitle(`Points Information for ${habbo_username}`)
				.addFields(
					{name: 'Pay Points Collected', value: `${collected.value} (**${weekly.value}** points this week) (**${reduction.value}** points deducted this week)`},
					{name: 'Total Vouches Logged', value: `${vouchers.value} (${eligible.value})`, inline: true},
					{name: 'Weekly Cap', value: `${claimed.value}`, inline: true},
					{name: 'Current Pay Points', value: `${current.value}`},
				)
				.setThumbnail(`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${habbo_username}`)
                .setFooter(`Data requested by ${message.author.username}`, message.author.avatarURL())
				msg.delete();
				message.reply({ embeds: [embed] });
			} else if (option == '-elective') {
				const msg = await message.reply(`Fetching data... (**This may take a couple of seconds!**)`);
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
				await lookup.loadCells('A1:F12');
				// Set the Habbo Username cell of the Sheet to the specified username
				lookup.getCellByA1('D3').value = habbo_username;
				// Save updated values
				await lookup.saveUpdatedCells();
				// Get data based on the Habbo username
				await lookup.loadCells('A1:F12');
				// Elective points
				const base = lookup.getCellByA1('D5');
				const act = lookup.getCellByA1('D6');
				const elec = lookup.getCellByA1('D7');
				const excused = lookup.getCellByA1('D8');
				const strike = lookup.getCellByA1('D9');
				// Display this data in an embeded message
				const embed = new Discord.MessageEmbed();
				embed.setTitle(`Points Information for ${habbo_username}`)
				.addFields(
					{name: 'Base Points', value: `${base.value}`, inline: true},
					{name: 'Elective Points', value: `${act.value}`, inline: true},
					{name: 'Total E.P', value: `${elec.value}`, inline: true},
					{name: 'Excused from Report', value: `${excused.value}`, inline: true},
					{name: 'No. of Strikes', value: `${strike.value}`, inline: true},
				)
				.setThumbnail(`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${habbo_username}`)
                .setFooter(`Data requested by ${message.author.username}`, message.author.avatarURL())
				msg.delete();
				message.reply({ embeds: [embed] });
			} else {
				// Else,
				const msg1 = await message.reply(`Fetching data... (**This may take a couple of seconds!**)`);
				const req_friends = await fetch(`https://www.habbo.com/api/public/users/${req_profile.uniqueId}/friends`).then(res => res.json());
				var friend_count = Object.keys(req_friends).length;
				if (req_profile.selectedBadges[0] == null) {
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
						{name: 'Number of Friends', value: `${friend_count}`},
				)
				.setFooter(`Data requested by ${message.author.username}`, message.author.avatarURL())
				// Send the embeded message to the channel
				msg1.delete();
				message.reply({ embeds: [embed] });
				} else {
				var badge1 = req_profile.selectedBadges[0].code;
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
					{name: 'Number of Friends', value: `${friend_count}`},
					{name: 'First Displayed Badge', value: `Basically the badge beside your group badge.`}
				)
				.setImage(`http://images.habbo.com/c_images/album1584/${badge1}.gif`)
				.setFooter(`Data requested by ${message.author.username}`, message.author.avatarURL())
				// Send the embeded message to the channel
				msg1.delete();
				message.reply({ embeds: [embed] });
			}
			}
		} catch(err) {
			console.log(err);
			message.reply('Error encountered. Please ping Purl#0001 with regards to this issue.')
		}
	}
});