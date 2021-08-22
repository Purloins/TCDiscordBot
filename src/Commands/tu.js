const { GoogleSpreadsheet } = require("google-spreadsheet");
const Command = require("../Structures/Command.js");
const Discord = require("discord.js");
// Credentials to log into Google Auth
const creds = require("../Structures/credentials.json");

module.exports = new Command({
	name: 'tu',
	usage: 'tu (manual/discharged)',
	description: 'In case you need to manually transfer someone, use this command!',
	
	async run (message, args) {
		try {
			// Shortcut function of setting permissions
			function allow(rolename) {
				const allowed_roles = message.member.roles.cache.some(role => role.name === rolename);
				return allowed_roles
			}
			// If member is not part of Transfer unit, return error
			if (!allow('Presidential Board') && !allow('Family Successors') && !allow('Transfer Unit Director') && !allow('Transfer Unit')) {
				return message.reply('🚨 `You are not a member of Transfer Unit!`');
			}
			const msg = await message.channel.send(`Fetching data... (**This may take a couple of seconds!**)`);
			// Link to Linda's personal TU sheet
			const doc = new GoogleSpreadsheet('1TdexMpPlcPT9rYGsqE3lK6Ejdyun0IKPf7vxlf08pOc');
			// Connect to GoogleAuth
			await doc.useServiceAccountAuth({
				client_email: creds.client_email,
				private_key: creds.private_key,
			});
			// Load documents' information
			await doc.loadInfo();
			// Let type of command be first argument
			const type = args[1];
			// Command code
			if (type.toLowerCase() == 'manual') {
				// Let current div be second argument, and no. of div third
				const division = args[2];
				const numberofdiv = args[3];
                if (!division || !numberofdiv) {
                    return message.reply('One of the arguments was left empty!');
                }
				// Loads the input section of the Manual Formula
				const tu_sheet = doc.sheetsByIndex[1];
				// Loads the cells
				await tu_sheet.loadCells('A1:J23');
				// Calculate formula
				tu_sheet.getCellByA1('F13').value = Math.ceil((Number(division)/Number(numberofdiv)*21)-1)
				// Save the updated data into the sheet
				await tu_sheet.saveUpdatedCells();
				await tu_sheet.loadCells('A1:J23');
				// Send an embedded message with the data
				const embed = new Discord.MessageEmbed();
				embed.setTitle('Manual Transfer Result')
				.addFields(
					{name: 'Final Division', value: `${tu_sheet.getCellByA1('F15').value}`, inline: true},
					{name: 'Rank to Offer', value: `${tu_sheet.getCellByA1('F17').value}`, inline: true}
				)
				message.reply({ embeds: [embed] });
			}
			else if (type.toLowerCase() == 'discharged') {
				// Let second argument be Habbo username
				const habbo_username = args[2];
				// Loads the Discharged sheet
				const dc_sheet = doc.sheetsByIndex[3];
				// Loads the cells needed
				await dc_sheet.loadCells('A1:J16');
				sheet.getCellByA1('C6').value = habbo_username;
				// Update the spreadsheet
				await dc_sheet.saveUpdatedCells();
				// Shows the data in an embedded message
				await dc_sheet.loadCells('A1:J16');
				const embed = new Discord.MessageEmbed();
				embed.addField(habbo_username, `**Reason:** ${dc_sheet.getCellByA1('C8')}`)
				msg.delete();
				message.reply({ embeds: [embed] })
			}
		} catch (err) {
			console.log(err)
			message.channel.send('Error occured! Please ping my bot developer regarding this issue! >.<')
		}
	}
});