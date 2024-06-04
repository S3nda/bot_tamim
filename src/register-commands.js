require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
  {
    name: "cesar",
    description: "sends embed",
  },
  {
    name: "censurer",
    description: "censure un nombre défini de messages",
    options: [
      {
        name: "nombre-de-messages",
        description: "combien de messages à censurer",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      { body: commands },
    );
    console.log("Slash commands were registered succesfully ! ");
  } catch (error) {
    console.log(`There was an error ${error}`);
  }
})();
