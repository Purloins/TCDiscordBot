const {
    GoogleSpreadsheet
} = require("google-spreadsheet");
const Command = require("../Structures/Command.js");
const Discord = require("discord.js");

const creds = require("../Structures/credentials.json");

module.exports = new Command({
    name: "vote",
    usage: "vote (wotw/votw)",
    description: "Count how many votes each member has in each voting phase.",

    async run(message, args) {
        const doc = new GoogleSpreadsheet('180pretMq6fJrTIQQX3J5KP1bRxhJogGjtTjjfwTwa9A');
        // Uses Google Sheets Auth
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
        });
        // Loads the document information
        await doc.loadInfo(); 
        // Takes in the argument
        const type = args[1];
        // If error, return error
        try {
            if (type.toLowerCase() == "wotw") {
                const sheet = doc.sheetsByIndex[10];
                const rows = await sheet.getRows();

                rows.forEach(row => {
                    const embed = new Discord.MessageEmbed();
                    embed.addField(row._rawData[0], `has received ${row._rawData[1]} votes!`)
                    .setThumbnail(`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${row._rawData[0]}`)
                    message.channel.send({
                        embeds: [embed]
                    });
                })
        }
        else if (type.toLowerCase() == "votw") {
            const sheet = doc.sheetsByIndex[11];
            const rows = await sheet.getRows();

            rows.forEach(row => {
                const embed = new Discord.MessageEmbed();
                embed.addField(row._rawData[0], `has received ${row._rawData[1]} votes!`)
                .setThumbnail(`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${row._rawData[0]}`)
                message.channel.send({
                    embeds: [embed]
                });
            })
    }
    } catch(err) {
        console.log(err);
    }
}});