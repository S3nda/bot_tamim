require("dotenv").config();
//const alive = require("./keep_alive.js");
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  Collection,
  Routes,
  REST
} = require("discord.js");


const fs = require("node:fs");
const path = require("node:path");
const rest = new REST().setToken(process.env.TOKEN);
const foldersPath = path.join(__dirname, "../commands/");
const commandFolders = fs.readdirSync(foldersPath);
const commands = [];

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.commands = new Collection();


for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

(async () => {
  try {
    console.log(
      `Started refreshing ${client.commands.length} application (/) commands.`,
    );
    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      { body: commands },
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    console.error(error);
  }
})();



client.on("ready", (c) => {
  console.log(`✅ ${c.user.tag} is online `);
});

client.on("messageCreate", (message) => {
  if (message.content.replace(/[\s\?\.\!\:\;\/]/g, "").endsWith("quoi")) {
    message.reply("coubeh :>");
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  console.log(client.commands);

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    interaction.reply("petite erreur je crois ^^");
  }
});

client.login(process.env.TOKEN);
