const fs = require("fs");
const dotenv = require("dotenv");
const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { Player } = require("discord-player");
const { GatewayIntentBits, Partials } = require("discord.js");

dotenv.config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const LOAD_SLASH = false;

const client = new Discord.Client({
  partials: [Partials.Channel, Partials.GuildMember],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

console.info("Bot Starting");

client.slashcommands = new Discord.Collection();
client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

let commands = [];

const slashFiles = fs
  .readdirSync("./slash")
  .filter((file) => file.endsWith(".js"));
for (const file of slashFiles) {
  const slashcmd = require(`./slash/${file}`);
  client.slashcommands.set(slashcmd.data.name, slashcmd);
  if (LOAD_SLASH) commands.push(slashcmd.data.toJSON());
}

//Registers commands for the bot to use
if (LOAD_SLASH) {
  const rest = new REST().setToken(TOKEN);
  console.log("Deploying slash commands");

  //Routes.applicationCommands(CLIENT_ID) - Deploy Commands Globally
  //Routes.applicationGuildCommands(CLIENT_ID,GUILD_ID) - Deploy Commands To A Specific Server (for testing)
  rest
    .put(Routes.applicationCommands(CLIENT_ID), { body: commands })
    .then(() => {
      console.log("Successfully loaded");
      process.exit(0);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
    });
}
//Regular Startup
else {
  console.info("Finished Startup");
  client.on("ready", () => {
    console.log(
      `Logged in as ${client.user.tag} and ready to accept commands!\n`
    );
  });
  //Check to see if there is another person with the bot. If not, it will disconnect.
  client.on("voiceStateUpdate", (oldState, newState) => {
    if (newState.guild.members.me.voice.channel === null) return;
    else if (newState.guild.members.me.voice.channel.members.size === 1) {
      newState.guild.members.me.voice.disconnect();
      return;
    }
  });

  //Command Handler
  client.on("interactionCreate", (interaction) => {
    async function handleCommand() {
      if (!interaction.isCommand()) return;

      const slashcmd = client.slashcommands.get(interaction.commandName);
      if (!slashcmd) interaction.reply("Not a valid slash command");

      await interaction.deferReply();
      await slashcmd.run({ client, interaction });
    }
    handleCommand();
  });
  client.login(TOKEN);
}
