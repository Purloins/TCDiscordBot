const { GoogleSpreadsheet } = require("google-spreadsheet");
const pagination = require('discord.js-pagination');
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
			const waitmsg = await message.reply(`Fetching data... (**This may take a couple of seconds!**)`);
			// Fetch data API from Habbo API
			const req_profile = await fetch(`https://www.habbo.com/api/public/users?name=${encodeURIComponent(habbo_username)}`).then(res => res.json());
			// If user profile does not exist, print error
			if (req_profile.error == "not-found" || !req_profile.lastAccessTime) {
				return message.reply('Habbo user cannot be found. Did you mistype their username?')
			}
			// Page 1: Habbo Information
			const req_friends = await fetch(`https://www.habbo.com/api/public/users/${req_profile.uniqueId}/friends`).then(res => res.json());
			var friend_count = Object.keys(req_friends).length;
			var last_login = req_profile.lastAccessTime.slice(0, 10);
			// Create embed with the captured data
			const embed1 = new Discord.MessageEmbed();
			embed1.setTitle(`User Details for ${habbo_username}`)
			.setDescription('・──・──・୨୧・──・──・⁣⁣──')
			.setThumbnail(`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${habbo_username}`)
			.addFields(
				{name: 'Level', value: `${req_profile.currentLevel}, ${req_profile.totalExperience} EXP, (${req_profile.currentLevelCompletePercent}%)\n**${req_profile.starGemCount}**⭐`},
				{name: 'Motto', value: `${req_profile.motto}`},
				{name: 'Last Online Time', value: `${last_login}`},
				{name: 'Number of Friends', value: `${friend_count}`},
			)
			.setFooter(`Data requested by ${message.author.username}`, message.author.avatarURL())
			// Page 2: Pay Information
				const doc1 = new GoogleSpreadsheet('1ShptIEDkhp3Vjc8RwxUVEqaW3_LvBofzrFxbw-o_qfg'); // Setting the Sheet to take data from
				// Connecting to the sheet using Google Auth
				await doc1.useServiceAccountAuth({
					client_email: creds.client_email,
					private_key: creds.private_key,
				});
				// Let's load the document information
				await doc1.loadInfo();
				// Load the necessary cells first
				const lookup1 = doc1.sheetsByIndex[1];
				await lookup1.loadCells('A1:F12');
				// Set the Habbo Username cell of the Sheet to the specified username
				lookup1.getCellByA1('C3').value = habbo_username;
				// Save updated values
				await lookup1.saveUpdatedCells();
				// Get data based on the Habbo username
				await lookup1.loadCells('A1:F12');
				// Pay points
				const collected = lookup1.getCellByA1('C4');
				const current = lookup1.getCellByA1('C5');
				const claimed = lookup1.getCellByA1('C6');
				const eligible = lookup1.getCellByA1('C7');
				const vouchers = lookup1.getCellByA1('C8');
				const weekly = lookup1.getCellByA1('C9');
				const reduction = lookup1.getCellByA1('C10');
				// Display this data in an embeded message
				const embed2 = new Discord.MessageEmbed();
				embed2.setTitle(`Points Information for ${habbo_username}`)
				.addFields(
					{name: 'Pay Points Collected', value: `${collected.value} (**${weekly.value}** points this week) (**${reduction.value}** points deducted this month)`},
					{name: 'Total Vouches Logged', value: `${vouchers.value} (${eligible.value})`, inline: true},
					{name: 'Weekly Cap', value: `${claimed.value}`, inline: true},
					{name: 'Current Pay Points', value: `${current.value}`},
				)
				.setThumbnail(`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${habbo_username}`)
                .setFooter(`Data requested by ${message.author.username}`, message.author.avatarURL())
			// Page 3: Elective Information
				const doc2 = new GoogleSpreadsheet('1ShptIEDkhp3Vjc8RwxUVEqaW3_LvBofzrFxbw-o_qfg'); // Setting the Sheet to take data from
				// Connecting to the sheet using Google Auth
				await doc2.useServiceAccountAuth({
					client_email: creds.client_email,
					private_key: creds.private_key,
				});
				// Let's load the document information
				await doc2.loadInfo();
				// Load the necessary cells first
				const lookup2 = doc2.sheetsByIndex[1];
				await lookup2.loadCells('A1:F12');
				// Set the Habbo Username cell of the Sheet to the specified username
				lookup2.getCellByA1('D3').value = habbo_username;
				// Save updated values
				await lookup2.saveUpdatedCells();
				// Get data based on the Habbo username
				await lookup2.loadCells('A1:F12');
				// Elective points
				const base = lookup2.getCellByA1('D5');
				const act = lookup2.getCellByA1('D6');
				const elec = lookup2.getCellByA1('D7');
				const excused = lookup2.getCellByA1('D8');
				const strike = lookup2.getCellByA1('D9');
				// Display this data in an embeded message
				const embed3 = new Discord.MessageEmbed();
				embed3.setTitle(`Points Information for ${habbo_username}`)
				.addFields(
					{name: 'Base Points', value: `${base.value}`, inline: true},
					{name: 'Elective Points', value: `${act.value}`, inline: true},
					{name: 'Total E.P', value: `${elec.value}`, inline: true},
					{name: 'Excused from Report', value: `${excused.value}`, inline: true},
					{name: 'No. of Strikes', value: `${strike.value}`, inline: true},
				)
				.setThumbnail(`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${habbo_username}`)
                .setFooter(`Data requested by ${message.author.username}`, message.author.avatarURL())
				pages = [
					embed1,
					embed2,
					embed3
				];
			emojiList = ['⏪', '⏩'];
			timeout = '10000';
		waitmsg.delete();
		pagination(message, pages, emojiList, timeout);
		
		} catch(err) {
			console.log(err);
			message.reply('Error encountered. Please ping Purl#0001 with regards to this issue.')
		}
	}
});