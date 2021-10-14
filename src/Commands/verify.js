const Discord = require('discord.js'); // Calling Discord.js
// Structures and commands
const Command = require('../Structures/Command.js');
const fetch = require("node-fetch");
const req = require('express/lib/request');
const { use } = require('express/lib/application');

const user_code = [];
module.exports = new Command({
	name: 'verify',
	usage: 'verify',
	description: 'Verifies the Habbo user on Discord and gives them the @Verified role.',
	
	// Command code
	async run(message, args) {
		const { guild } = message
		const habbo_username = args[1]; // Set the first argument to the Habbo username
		const vcode = args[2]; // Set the first argument to the Habbo username
		
		if (!args[1]) { // If they dont specify a username
			message.reply("❌| __Please specify your Habbo username!__ Usage: **%verify <Habbo username>**")
			return
		}
		if (!vcode) { // If they do not specify a verification code
			user_code.pop();
			const code = Date.now().toString(36);
			user_code.push([message.author.username+"#"+message.author.discriminator, "TC-"+code])
			message.reply("✔ | __The verification code has been sent to your DMs!__")
			// Asks the user to change their Habbo motto to their veification code
			message.author.send(`Please change your Habbo motto to \`TC-${code}\` then run the command \`%verify <Habbo username>\`.`)
		}
		else {
			console.log(user_code)
			// Get the user profile and convert to a JSON file
			const req_profile = await fetch(`https://www.habbo.com/api/public/users?name=${encodeURIComponent(habbo_username)}`).then(res => res.json());
			if (req_profile.error) {
				message.reply("❓| We could **__not__** find a user with that name!")
			}
			if (req_profile.motto !== user_code[0][1]) {
				message.reply("❎ | Your motto does not match your verification code!")
			}
			else {
				let role = message.guild.roles.cache.find((role) => {
					return role.name === "Verified"
				})
				const member = guild.members.cache.get(message.author.id)
				member.roles.add(role);
				const embed = new Discord.MessageEmbed();
				embed.setTitle(`✅ | __Verification **Successful**__ for ${habbo_username}`)
				.setDescription("Roles have been given out!")
				.setThumbnail(`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${habbo_username}`)
				message.reply({ embeds: [embed] });
			}
		}
	}
})