const Command = require("../Structures/Command.js");
const Discord = require("discord.js");

module.exports = new Command({
    name: "help",
    usage: "help",
    description: "SDisplays all the commands available to use on Zedd bot.",
    
    async run(message, args, client) {
        try {
            const helpcmd = args[1];
            // If there are no arguments, print default help menu
            if(!helpcmd) {
                const embed = new Discord.MessageEmbed();
                embed.setTitle("List of commands available for Zedd")
                .addFields(
                    {name: '🌼 `General Commands`', value: '`➝ about`\n`➝ clear`\n`➝ help`\n`➝ ping`\n`➝ role [@username] [role]`', inline: true},
                    {name: '🌙 `Internal Affairs`', value: '`➝ ia lookup [username]`', inline: true},
                    {name: '☀️ `Transfer Unit`', value: '`➝ tu manual [cur. div] [no. of div]`\n`➝ tu discharged [username]`', inline: true},
                    {name: '🌷 `Panem Personal Affairs`', value: '`➝ ppa wotw | votw`\n`➝ vote wotw | votw`', inline: true},
                )
                .setThumbnail('https://c.tenor.com/4ThBfmyec2cAAAAd/vanitas-vanitas-no-carte.gif')
                .setFooter("Do %help (command) to find out more information about a command!")
                message.channel.send({embeds: [embed]});
            }
            else {
                const fs = require("fs");
                fs.readdirSync("C:/Users/Ryzen/Documents/Discord Bot/src/Commands").filter(file => file.endsWith(".js"));
                const command = require(`C:/Users/Ryzen/Documents/Discord Bot/src/Commands/${helpcmd}`);
                message.reply(`${command.description}\n**Usage:** ${command.usage}`);
            }
    } catch (err) {
        message.reply('The command cannot be found! You alright?')
    }}
})
