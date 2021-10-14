const Discord = require('discord.js'); // Calling Discord.js
// Structures and commands
const Command = require('../Structures/Command.js');

module.exports = new Command({
	name: 'getcode',
	usage: 'getcode',
	description: 'Gives you a verification code for you to use during %verify.',
	
	// Command code
	async run(message, [habbo]) {
		// If no code and everything is successful,
		const code = Date.now().toString(36);
		await message.author.send(`Please change your Habbo motto to \`TC-${code}\` then run the command \`%verify <Habbo username>\`.`)
			.catch(() => {
				message.author.settings.reset('verificationCode');
				throw 'Please make sure that I can send you DMs!';
			});
		this.query.set(message.author.id, code);
		message.channel.send('Your verification code has been generated! Please check your DMs.');
	}
})