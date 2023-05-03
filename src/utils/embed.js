const { EmbedBuilder } = require("discord.js");

module.exports = (interaction, description, color = "#2F3136") => {

    if (color == "red") color = "#e64c4c";
    else if (color == "green") color = "#67eb74";
    else if (color == "info") color = "#dbd160";

    const response = new EmbedBuilder()
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({dynamic:true}) })
    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({dynamic:true}) })
    .setDescription(description)
    .setTimestamp()
    .setColor(color)


    return response;
}