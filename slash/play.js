const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Plays any song/link you give it")
        .addStringOption(option =>
            option.setName("song").setDescription("the song's url or name").setRequired(true)
            ),
	run: async ({ client, interaction }) => {
		if (!interaction.member.voice.channel) return interaction.editReply("You need to be in a VC to use this command")

        if (!interaction.guild.members.me.permissionsIn(interaction.member.voice.channel).has('Connect')){
            return interaction.editReply("Cannot Join VC. This is due to a permission error. (Either give the bot exclusive rights to connect the channel or give it Administrator)")
        }

		const queue = await client.player.createQueue(interaction.guild, {
            leaveOnEnd: true,
            leaveOnStop: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 5,
            autoSelfDeaf: true,
            })
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new EmbedBuilder()

        if (interaction.commandName === "play") {
            let url = interaction.options.getString("song")
            //console.info(url)
            //Checks whether the user input is a link. If not, it will just search up the text given and add it to the queue.
            if (url.includes("https://")){
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })
                //console.info(result)
                if (result.tracks.length === 0)
                    return interaction.editReply("No results")
                
                const playlist = result.playlist
                if (playlist == null){
                    const song = result.tracks[0]
                    await queue.addTrack(song)
                    console.info("[" + interaction.guild.name + "] added " + song.title + " to their queue")
                    embed
                        .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                        .setThumbnail(song.thumbnail)
                        .setFooter({ text: `Duration: ${song.duration}`})
                }
                else{
                    await queue.addTracks(result.tracks)
                    console.info("[" + interaction.guild.name + "] added " + playlist.title + " to their queue")
                    embed
                        .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`)
                        
                }
            }
            else{
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_SEARCH
                })

                if (result.tracks.length === 0)
                    return interaction.editReply("No results")
                
                const song = result.tracks[0]
                await queue.addTrack(song)
                console.info("[" + interaction.guild.name + "] added " + song.title + " to their queue")
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}`})
		    }
        } 
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
	},
}
