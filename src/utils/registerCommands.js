module.exports = (client, type = "global", serverId) => {

    const commands = client.commands.map(command => command.data);

    if (type == "global") {
        client.application.commands.set(commands)
            .then(() => {         
            console.log(`Successfully reloaded ${commands.length} application (/) commands on global.`)          
        });
    }
    else if (type == "guild") {
        const guild = client.guilds.cache.get(serverId);
        guild.commands.set(commands)                     
            .then(() => {               
            console.log(`Successfully reloaded ${commands.length} application (/) commands on guild.`)         
        });  
    }
}