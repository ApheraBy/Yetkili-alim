const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config.json");
const { readdirSync } = require("fs");

const client = new Client({     
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
      ],
    partials: [  
        Partials.Channel, 
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
    ]
})

client.commands = new Collection();
client.embed = require("./utils/embed.js");
client.config = config;

readdirSync("./src/events").forEach(async file => {    
    const event = require(`./events/${file}`)
    event(client);
})

readdirSync("./src/commands").forEach(category => {
    readdirSync(`./src/commands/${category}`).forEach(async file => {
        const command = require(`./commands/${category}/${file}`);
        client.commands.set(command.data.name, command);
    })

})

client.login(config.bot.token)