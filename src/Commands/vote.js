const {
    GoogleSpreadsheet
} = require("google-spreadsheet");
const Command = require("../Structures/Command.js");
const Discord = require("discord.js");

const creds = require("../Structures/credentials.json");

module.exports = new Command({
	name: 'vote',
	usage: 'vote wotw | votw | cof',
	description: 'Check the number of votes for each member in the voting phase.',
	
	async run(message, args) {
        const msg = await message.channel.send(`Fetching data... (**This may take a couple of seconds!**)`);
		// Load the cof_count sheet from the CRC mainsheet
		const doc = new GoogleSpreadsheet('180pretMq6fJrTIQQX3J5KP1bRxhJogGjtTjjfwTwa9A');
		// Connect to Google Sheets Auth
		await doc.useServiceAccountAuth({
			client_email: creds.client_email,
			private_key: creds.private_key,
		});
		// Load the document information
		await doc.loadInfo();
		// Take the command type as the first agument
		const type = args[1];
		// Command
		try {
			list_of_wotw_nominees = [];
            // If first argument is WOTW,
			if (type.toLowerCase() == 'wotw') {
				const sheet = doc.sheetsByIndex[10]; // Takes in the wotw_count sheet
				const rows = await sheet.getRows(); // Takes in the rows
				// For each row, append to list
				rows.forEach(row => {
					list_of_wotw_nominees.push([row._rawData[0], row._rawData[1], row._rawData[2]]); 
				});
                // Send the data with embedded message
                const embed = new Discord.MessageEmbed();
                embed.setTitle(`Number of votes for Worker of the Week`)
                for (let i = 0; i < list_of_wotw_nominees.length; i++) {
                    const nom_username = list_of_wotw_nominees[i][0];
                    const nom_votes = list_of_wotw_nominees[i][1];
                    const nom_percentage = list_of_wotw_nominees[i][2];
                    embed.addField(`↝ ${nom_username}`, `${nom_votes} votes (${nom_percentage}%)`)
                }
                msg.delete();
                message.channel.send({ embeds: [embed] });
			}
            // If first argument is VOTW,
			list_of_votw_nominees = [];
			if (type.toLowerCase() == 'votw') {
				const sheet = doc.sheetsByIndex[11]; // Takes in the wotw_count sheet
				const rows = await sheet.getRows(); // Takes in the rows
				// For each row, append to list
				rows.forEach(row => {
					list_of_votw_nominees.push([row._rawData[0], row._rawData[1], row._rawData[2]]); 
				});
                // Send the data with embedded message
                const embed = new Discord.MessageEmbed();
                embed.setTitle(`Number of votes for Victor of the Week`)
                for (let i = 0; i < list_of_votw_nominees.length; i++) {
                    const nom_username = list_of_votw_nominees[i][0];
                    const nom_votes = list_of_votw_nominees[i][1];
                    const nom_percentage = list_of_votw_nominees[i][2];
                    embed.addField(`↝ ${nom_username}`, `${nom_votes} votes (${nom_percentage}%)`)
                }
                msg.delete();
                message.channel.send({ embeds: [embed] });
			}
            // If first argument is COF,
			list_of_cof_nominees = [];
			if (type.toLowerCase() == 'cof') {
				const sheet = doc.sheetsById['83376018']; // Takes in the cof_count sheet
				const rows = await sheet.getRows(); // Takes in the rows
				// For each row, append to list
				rows.forEach(row => {
					list_of_cof_nominees.push([row._rawData[0], row._rawData[1], row._rawData[2]]); 
				});
                // Send the data with embedded message
                const embed = new Discord.MessageEmbed();
                embed.setTitle(`Number of votes for Citizen on Fire`)
                for (let i = 0; i < list_of_cof_nominees.length; i++) {
                    const nom_username = list_of_cof_nominees[i][0];
                    const nom_votes = list_of_cof_nominees[i][1];
                    const nom_percentage = list_of_cof_nominees[i][2];
                    embed.addField(`↝ ${nom_username}`, `${nom_votes} votes (${nom_percentage}%)`)
                }
                msg.delete();
                message.channel.send({ embeds: [embed] });
			} 
		} catch (err) {
			console.log(err);
		}
	}
});