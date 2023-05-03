const { EmbedBuilder } = require("discord.js");

module.exports.data = {
    name: "ping",
    description: "pong",
    cooldown: 10,
    async execute(interaction, client) {

        interaction.reply({ content: "🏓 Pong" })
        
    }
}