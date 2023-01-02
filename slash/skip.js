const { SlashCommandBuilder } = require("@discordjs/builders")
const { QueueRepeatMode } = require('discord-player');
const { EmbedBuilder } = require("discord.js")


module.exports = {
	data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue || !queue.playing) return await interaction.editReply("There are no songs in the Queue.")

        const currentSong = queue.current
        queue.setRepeatMode(QueueRepeatMode.OFF)
		queue.skip()
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${currentSong.title} has been skipped!`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
	},
}
