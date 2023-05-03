const registerCommands = require("../utils/registerCommands.js");

module.exports = (client) => {

    client.once("ready", async () => {       
        registerCommands(client, "global")
    })
}