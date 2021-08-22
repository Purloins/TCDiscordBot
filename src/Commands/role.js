const Command = require("../Structures/Command.js");
const { Permissions } = require('discord.js');
const Discord = require("discord.js");

module.exports = new Command({
	name: 'role',
	usage: 'role {@mention} {role name}',
	description: 'Slams the specified role onto the specified user.',
	
	async run (message, args) {
        // If user does not have "MANAGE_ROLESS" permission, return error
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
			return message.reply('🚨 `You do not have sufficient permission to do that!`')
		}
		// Let the target user be the first specified mention
		const target = message.mentions.users.first();
		// If target is empty, ask them to specify someone
		if (!target) {
			return message.reply('Please give me someone to give a role to!');
		}
		// Let the name of the role be the 2nd argument
		const rolename = args[2];
		// If user already has role, then send an error
		const { guild } = message;
		const role = guild.roles.cache.find((role) => {
			return role.name === rolename
		})
		// If a role is not specified or can't be found, give error
		if (!role) {
			return message.reply(`Unable to locate the role called **${rolename}**!`);
		}
		// Give role to user
		const member = guild.members.cache.get(target.id);
		member.roles.add(role);
		// Print out success message through embed
		const embed = new Discord.MessageEmbed();
		embed.addField('Role has been assigned!', `${role} has been given to ${target}!`);
		message.channel.send({ embeds: [embed] });
	}
});