const { GoogleSpreadsheet } = require("google-spreadsheet");
const Command = require("../Structures/Command.js");
const Discord = require("discord.js");
// Credentials details for Google Auth
const creds = require("../Structures/credentials.json");

module.exports = new Command({
	name: 'ia',
	description: 'Used by Internal Affairs to make some things easier.',
	usage: 'ia lookup {username}',
	
	async run (message, args) {
		try {
			// Shortcut function of setting permissions
			function allow(rolename) {
				const allowed_roles = message.member.roles.cache.some(role => role.name === rolename);
				return allowed_roles
			}
			// If member is not part of Internal Affairs, return error
			if (!allow('Presidential Board') && !allow('Family Successors') && !allow('Internal Affairs Director') && !allow('Internal Affairs')) {
				return message.reply('🚨 `You are not a member of Internal Affairs!`');
			}
			const doc = new GoogleSpreadsheet('1ShptIEDkhp3Vjc8RwxUVEqaW3_LvBofzrFxbw-o_qfg'); // Setting the Sheet to take data from
			// Setting the arguments
			const type = args[1];
			const habbo_username = args[2];
			// Connecting to the sheet using Google Auth
			await doc.useServiceAccountAuth({
				client_email: creds.client_email,
				private_key: creds.private_key,
			});
			// Let's load the document information
			await doc.loadInfo();
			// Working on lookup command
			if (type.toLowerCase() == 'lookup') {
				// Load the necessary cells first
				const ia_sheet = doc.sheetsByIndex[2];
				await ia_sheet.loadCells('A1:G9');
				// Set the Habbo Username cell of the Sheet to the specified username
				ia_sheet.getCellByA1('C3').value = habbo_username;
				// Save updated values
				await ia_sheet.saveUpdatedCells();
				
				// Get data based on the Habbo username
				await ia_sheet.loadCells('A1:G9');
				// Rank, points information
				const tc_rank = ia_sheet.getCellByA1('C4');
				const pay_points = ia_sheet.getCellByA1('C5');
				const elec_points = ia_sheet.getCellByA1('C6');
				const report_status = ia_sheet.getCellByA1('C7');
				// Retirement, resignment, etc.
				const retire_status = ia_sheet.getCellByA1('E3');
				const resign_status = ia_sheet.getCellByA1('E4');
				const hiatus_status = ia_sheet.getCellByA1('E5');
				
				// Display this data in an embeded message
				const embed = new Discord.MessageEmbed();
				embed.setTitle(`IA Habbo Lookup for ${habbo_username}`)
                .setDescription('・──・──・୨୧・──・──・⁣⁣──')
				.addFields(
					{name: 'TC Rank', value: `${tc_rank.value}`},
					{name: 'Retirement', value: `${retire_status.value}`, inline: true},
					{name: 'Resignment', value: `${resign_status.value}`, inline: true},
					{name: 'Hiatus', value: `${hiatus_status.value}`, inline: true},
					{name: 'Pay Points', value: `${pay_points.value}`, inline: true},
					{name: 'Elective Points', value: `${elec_points.value}`, inline: true},
					{name: 'Report Status', value: `${report_status.value}`, inline: true}
				)
				.setThumbnail(`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${habbo_username}`)
                .setFooter(`Data requested by ${message.author.username}`, message.author.avatarURL())
				message.channel.send({ embeds: [embed] });
			}
		} catch (err) {
            console.log(err);
			message.channel.send('Error occured! Please ping my bot developer regarding this issue! >.<');
		}		
	}
})
