const { GoogleSpreadsheet } = require("google-spreadsheet");
const Command = require("../Structures/Command.js");
const Discord = require("discord.js");
// Credentials details for Google Auth
const creds = require("../Structures/credentials.json");

// List of PPA members (use something else in future)
const list = ['Pleska', 'PolarIvana', 'reinamayu', 'erlindagrace', '-Temporarily', 'StarChill'];
const workerlist = [];
const victorlist = [];

module.exports = new Command({
	name: 'ppa',
	usage: 'ppa wotw | votw',
	description: 'PPA commands to check nominations for WOTW and VOTW.',
	
	async run (message, args) {
		try {
            const msg = await message.channel.send(`Fetching data... (**This may take a couple of seconds!**)`);
			// Fetch data from Zedd Bot Integration Sheet
			const doc = new GoogleSpreadsheet('1ShptIEDkhp3Vjc8RwxUVEqaW3_LvBofzrFxbw-o_qfg');
			// Log in with GoogleAuth
			await doc.useServiceAccountAuth({
				client_email: creds.client_email,
				private_key: creds.private_key,
			});
			// Load document's information
			await doc.loadInfo();
			// Let first argument be the command type
			const type = args[1];
			// Print out different things based on command type
			if (type.toLowerCase() == 'wotw') {
				const sheet = doc.sheetsByIndex[4];
				for (let i = 0; i < list.length; i++) {
					await sheet.loadCells('A1:F9');
					// Set Habbo username to the looped value
					sheet.getCellByA1('C3').value = list[i];
					// Save updated value
					await sheet.saveUpdatedCells();
					// Get data based on the updated value
					await sheet.loadCells('A1:F9');
					// Information
					const voted = sheet.getCellByA1('C4').value;
					const nomination = sheet.getCellByA1('C5').value;
					// Push it to the checklist array
					workerlist.push([list[i], voted, nomination]);
					
				}
                const embed = new Discord.MessageEmbed();
                embed.setTitle(`Members Nomination for Worker of the Week`)
				for (let x = 0; x < list.length; x++) {
                    const habusername = workerlist[x][0];
                    const nom = workerlist[x][2];
                    if (isNaN(nom)) {
                        embed.addField(`✅ ${habusername}`, `${nom}`, true)
                    }
                    else {
                        embed.addField(`❎ ${habusername}`, `${nom}`, true)
                    }
				}
                msg.delete();
                message.channel.send({ embeds: [embed] });
			}
            if (type.toLowerCase() == 'votw') {
				const sheet = doc.sheetsByIndex[4];
				for (let i = 0; i < list.length; i++) {
					await sheet.loadCells('A1:F9');
					// Set Habbo username to the looped value
					sheet.getCellByA1('D3').value = list[i];
					// Save updated value
					await sheet.saveUpdatedCells();
					// Get data based on the updated value
					await sheet.loadCells('A1:F9');
					// Information
					const voted = sheet.getCellByA1('D4').value;
					const nomination = sheet.getCellByA1('D5').value;
					// Push it to the checklist array
					victorlist.push([list[i], voted, nomination]);
				}
                const embed = new Discord.MessageEmbed();
                embed.setTitle(`Members Nomination for Worker of the Week`)
				for (let x = 0; x < list.length; x++) {
                    const habusername = victorlist[x][0];
                    const nom = victorlist[x][2];
                    if (isNaN(nom)) {
                        embed.addField(`✅ ${habusername}`, `${nom}`, true)
                    }
                    else {
                        embed.addField(`❎ ${habusername}`, `${nom}`, true)
                    }
				}
                msg.delete();
                message.channel.send({ embeds: [embed] });
			}
		} catch(err) {
            console.log(err);
			message.reply('Either there arent any values or you didnt specify an argument!');
			}
		}
	});