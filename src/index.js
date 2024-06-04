require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`✅ ${c.user.tag} is online `);
});

client.on("messageCreate", (message) => {
  console.log(message.content);

  if (message.content.replace(/[\s\?\.\!\:\;\/]/g, "").endsWith("quoi")) {
    message.reply("coubeh :>");
  }
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "censurer") {
    const num = interaction.options.get("nombre-de-messages").value;

    interaction.reply({
      content: `${num} messages censurés !`,
      ephemeral: true,
    });
  }

  if (interaction.commandName === "embed") {
    const embed = new EmbedBuilder()
      .setTitle("title")
      .setDescription("description")
      .setColor("Red")
      .addFields({ name: "Field1", value: "guez" });
    interaction.channel.send({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
