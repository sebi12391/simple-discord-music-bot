const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueueRepeatMode } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Enables/Disables looping of the currently playing song")
        .addStringOption(option =>
            option.setName("mode")
                .setDescription("Enables/Disables the loop function")
                .setRequired(true)
                .addChoices({ name: 'on', value: 'on' },{ name: 'off', value: 'off' })),
                
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no song being played!")

        const choice = interaction.options.getString("mode")
		
        if (choice === "on"){
            queue.setRepeatMode(QueueRepeatMode.TRACK)
        }
        else if (choice === "off"){
            queue.setRepeatMode(QueueRepeatMode.OFF)
        }

		await interaction.editReply(`Loop Mode is [${choice}].`)
	},
}
