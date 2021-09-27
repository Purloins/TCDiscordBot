const { GoogleSpreadsheet } = require("google-spreadsheet");
const Discord = require('discord.js'); // Calling Discord.js
// Structures and commands
const Command = require('../Structures/Command.js');
const fetch = require("node-fetch");
// Credentials details for Google Auth
const creds = require("../Structures/credentials.json");

module.exports = new Command({
	name: 'leaderboard',
	usage: 'leaderboard',
	description: 'Displays the first to third place for WOTW/VOTW/COF winners.',

	async run (message, args) {
		const doc = new GoogleSpreadsheet('1ShptIEDkhp3Vjc8RwxUVEqaW3_LvBofzrFxbw-o_qfg'); // Setting the Sheet to take data from

		// Connecting to the sheet using Google Auth
		await doc.useServiceAccountAuth({
			client_email: creds.client_email,
			private_key: creds.private_key,
		});
		// Let's load the document information
		await doc.loadInfo();
		// Load the necessary cells first
		const lookup = doc.sheetsByIndex[4];
		await lookup.loadCells('A1:F10');
		// Places
		const first = lookup.getCellByA1('D6');
		const first_votes = lookup.getCellByA1('E6');
		const second = lookup.getCellByA1('D7');
		const second_votes = lookup.getCellByA1('E7');
		const third = lookup.getCellByA1('D8');
		const third_votes = lookup.getCellByA1('E8');
		// Display this data in an embeded message
		const embed = new Discord.MessageEmbed();
		embed.setTitle(`TC Hall of Fame Leaderboard`)
		.setURL('https://docs.google.com/spreadsheets/d/e/2PACX-1vRyRATF_VgUaHId-SN0AXZCOGGaxOaoKGKuzlFIymgmVSzOj-hP3kTklQHvqbq-_M1NBwpoSdQkGZV5/pubhtml?gid=1698413331&single=true')
		.addField(`The following table only shows the Top 3 winners.`, `**1.** [${first.value}](https://www.habbo.com/profile/${first.value}) - ${first_votes.value} Wins 🥇\n**2.** [${second.value}](https://www.habbo.com/profile/${second.value}) - ${second_votes.value} Wins 🥈\n**3.** [${third.value}](https://www.habbo.com/profile/${third.value}) - ${third_votes.value} Wins 🥉\n\n\u200b`)
		.setThumbnail(`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${first.value}`)
		.setFooter(`Data requested by ${message.author.username}`, message.author.avatarURL())

		message.reply({ embeds: [embed] });
	}
})