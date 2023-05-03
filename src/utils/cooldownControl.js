const { Collection } = require("discord.js");
const config = require("../config.json");
const cooldowns = new Collection();

module.exports = (command, userId) => {

    if (config.owners.includes(userId)) return false;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection())
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 5) * 1000

    if (timestamps.has(userId)) {
        const expiration = timestamps.get(userId) + cooldownAmount
        if (now < expiration) {
            const timeLeft = Math.round((expiration - now) / 1000)
            return timeLeft
        }

        return false;
    }
    else {
        timestamps.set(userId, now);
        setTimeout(() => timestamps.delete(userId), cooldownAmount);
        return false;
    }
}