const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("help").setDescription("Displays the commands the bot has"),
	run: async ({ client, interaction }) => {

        await interaction.editReply("Commands\n/play {name/link} - plays a desired song\n/info - displays the current song\n/leave - leaves the VC and clears the queue\n/pause - pauses the song currently playing\n/resume - resumes playing the song\n/skip - skips the current song in the queue\n/loop {on/off} - enables/disables the looping of the currently playing song\n/shuffle - shuffles the playlist")
	},
}
