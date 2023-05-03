const cooldownControl = require("../utils/cooldownControl.js");

module.exports = (client) => {
  
    client.on("interactionCreate", interaction => {     
        if (!interaction.isChatInputCommand()) return;
        
        const { embed } = client;
      
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        
        const devs = ["763741722315456542", "212287313080877057", "622350390871982080"];
        
        if (command.dev && !config.BotOwners.includes(interaction.user.id)) return interaction.reply({
            ephemeral: true,
            embeds: [
                embed(interaction, `Bu komutu sadece kurucular kullanabilir!`, "red")
            ]
        });

        const cooldown = cooldownControl(command, interaction.user.id);
        
        if (cooldown) return interaction.reply({
            ephemeral: true,
            embeds: [
                embed(interaction, `Bu komutu tekrar kullanmak için \`${cooldown}\` saniye beklemeniz gerekiyor.`, "red")
            ]
        });
        

        try {
            command.data.execute(interaction, client);
        } catch (e) {
            interaction.reply({ 
                ephemeral: true,
                embeds: [
                    embed(interaction, "Bu komutu kullanırken bir sorun oluştu.", "red")
                ] 
            });
            console.log(e);
        }
    })
}