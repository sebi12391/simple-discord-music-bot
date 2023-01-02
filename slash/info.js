const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueueRepeatMode } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Displays info about the currently playing song"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)
		//const loopStatus = index.choice
		if (!queue) return await interaction.editReply("There are no songs in the Queue")
		

        const song = queue.current
		const loopStatus = ['off', 'on'];
		//console.info(song)
		await interaction.editReply({
			embeds: [new EmbedBuilder()
            .setThumbnail(song.thumbnail)
            .setDescription(`Currently Playing [${song.title}](${song.url}).\n\nLoop: ${loopStatus[queue.repeatMode]}\n`)
        	]
		})
	},
}
