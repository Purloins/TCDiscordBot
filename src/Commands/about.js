/*
Only put plugins/installed modules in this box.
Other things, like Discord.js, Fetching, etc. is put below.
*/
const { GoogleSpreadsheet } = require("google-spreadsheet");
const pagination = require('discord.js-pagination');

/*
Discord.js and other node modules here
*/
const Discord = require('discord.js');
const Command = require('../Structures/Command.js');
const fetch = require("node-fetch");

/*
Google Sheets API things?
*/
const creds = require("../Structures/credentials.json");
const sheet = new GoogleSpreadsheet('1ShptIEDkhp3Vjc8RwxUVEqaW3_LvBofzrFxbw-o_qfg');

// Actual code, wow no way!
module.exports = new Command({
	name: 'about',
	usage: 'about <Habbo username>',
	description: 'Displays the information of a TC member through the command.',
	
	async run(message, args) {
		const habbousername = args[1];
		try {
			const waitmsg = await message.reply("🍔 | **This might take awhile**, have a burger while you wait!");
			const profile = await fetch(`https://www.habbo.com/api/public/users?name=${encodeURIComponent(habbousername)}`).then(res => res.json());
			// Username is invalid:
			if (profile.error == "not-found" || !profile.lastAccessTime) {
				waitmsg.delete(); // Delete the "Taking some time" message
				return message.reply("❎ | I couldn't find that user, did you mistype their name?");
			}
			/*
			Page 1: Habbo Information
			Things such as their motto, last online time, friends, etc. will be displayed
			*/
			const friends = await fetch(`https://www.habbo.com/api/public/users/${profile.uniqueId}/friends`).then(res => res.json());
			var friendcount = Object.keys(friends).length;
			var logintime = profile.lastAccessTime.slice(0, 10);
			
			const page_1 = new Discord.MessageEmbed()
			.setTitle(`User Details for ${habbousername}`)
			.setDescription('・──・──・୨୧・──・──・⁣⁣──')
			.setThumbnail(`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${habbousername}`)
			.addFields(
				{name: 'Level', value: `${profile.currentLevel}, ${profile.totalExperience} EXP, (${profile.currentLevelCompletePercent}%)\n**${profile.starGemCount}**⭐`},
				{name: 'Motto', value: `${profile.motto}`},
				{name: 'Last Online Time', value: `${logintime}`},
				{name: 'Number of Friends', value: `${friendcount}`},
			)
			.setFooter('🥞 Want some pancakes?')
			
			/*
			Page 2: lookup Points Information
			They will be able to know how many points they have and whether they can collect lookup!
			*/
			// Okay, Zedd, connect to the form!
			await sheet.useServiceAccountAuth({
				client_email: creds.client_email,
				private_key: creds.private_key,
			});
			await sheet.loadInfo();
			const lookup = sheet.sheetsByIndex[1];
			await lookup.loadCells('A1:F12');
			lookup.getCellByA1('C3').value = habbousername;
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
			
			const page_2 = new Discord.MessageEmbed()
			.setTitle(`Points Information for ${habbousername}`)
			.setDescription('・──・──・୨୧・──・──・⁣⁣──')
			.setThumbnail(`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${habbousername}`)
			.addFields(
				{name: 'Pay Points Collected', value: `${collected.value} (**${weekly.value}** points this week) (**${reduction.value}** points deducted this month)`},
				{name: 'Total Vouches Logged', value: `${vouchers.value} (${eligible.value})`, inline: true},
				{name: 'Weekly Cap', value: `${claimed.value}`, inline: true},
				{name: 'Current Pay Points', value: `${current.value}`},
			)
			.setFooter('🧇 Want some waffles?')
			
			/*
			Page 3: Elective Points Information
			ONLY works if they are an elective member. If not, it will show "Not Elective".
			*/
			await lookup.loadCells('A1:F12');
			lookup.getCellByA1('D3').value = habbousername;
			await lookup.saveUpdatedCells();
			
			// Get data based on the Habbo username
			const base = lookup.getCellByA1('D5');
			const act = lookup.getCellByA1('D6');
			const elec = lookup.getCellByA1('D7');
			const excused = lookup.getCellByA1('D8');
			const strike = lookup.getCellByA1('D9');
			
			const page_3 = new Discord.MessageEmbed()
			.setTitle(`Elective Information for ${habbousername}`)
			.setDescription('・──・──・୨୧・──・──・⁣⁣──')
			.setThumbnail(`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${habbousername}`)
			.addFields(
				{name: 'Base Points', value: `${base.value}`, inline: true},
				{name: 'Elective Points', value: `${act.value}`, inline: true},
				{name: 'Total E.P', value: `${elec.value}`, inline: true},
				{name: 'Excused from Report', value: `${excused.value}`, inline: true},
				{name: 'No. of Strikes', value: `${strike.value}`, inline: true},
			)
			.setFooter('🥓 Want some bacon?')
			
			/*
			Pagination stuff below.
			*/
			pages = [page_1, page_2, page_3];
			emojiList = ['⏪', '⏩'];
			timeout = '10000';
			
			pagination(message, pages, emojiList, timeout);
			
			waitmsg.delete(); // Delete the "Taking some time" message
		}
		catch (err) {
			console.log(err);
			message.reply('Error encountered. Please ping Purl#0001 with regards to this issue.')
		}
	}
})