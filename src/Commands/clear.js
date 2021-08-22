const Command = require("../Structures/Command");
const { Permissions } = require('discord.js');

module.exports = new Command({
	name: 'clear',
	usage: 'clear {1-99}',
	description: 'Purges/clears a specified number of messages.',
	
	async run (message, args) {
		// If user does not have "MANAGE_MESSAGES" permission, return error
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
			return message.reply('🚨 `You do not have sufficient permission to do that!`')
		}
		// Specify the number of messages to be deleted as the first argument
		const msgs_deleted = args[1];
		// If no amount is specified or is NaN, return error
		if (!msgs_deleted || isNaN(msgs_deleted)) {
			return message.reply('Not a valid number!');
		}
		// Convert string to int by parsing
		const parsed_msgs = parseInt(msgs_deleted);
		// If amount specified is more than 100, return error as well
		if (parsed_msgs > 99) {
			return message.reply('You cannot purge more than 100 messages at once!');
		}
		// Delete the messages
		message.channel.bulkDelete(parsed_msgs);
		const msg = await message.channel.send(`Cleared ${parsed_msgs} messages!`);
		// Delete success message after awhile
		setTimeout(() => msg.delete(), 5000);
	}
});