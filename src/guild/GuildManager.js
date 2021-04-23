const EventEmitter = require("events");
const Guild = require("./Guild")
const fetch = require('node-fetch')

class GuildManager extends EventEmitter {
    /**
     * 
     * @param {Client} client 
     * @param {Array<Object>} guilds 
     */
    constructor(client, guilds = []) {
        super()
        Object.defineProperty(this, 'client', { value: client })
        this.cache = new Map()
        for (const guild of guilds) {
            if (guild instanceof Guild) this.cache.set(guild.id, guild)
            else this.cache.set(guild.id, new Guild(this.client, guild))
            console.log(`\nMade a guild. ${guild.id}\n`)
        }
    }

    /**
     * Searches for a guild.
     * @param {any} guildIdentifiable "The ID or name of a guild."
     * @returns {Promise<Guild>} "The Guild instance."
     */
    async fetch(guildIdentifiable, forceApi = false) {
        return new Promise((resolve, reject) => {
            if (typeof guildIdentifiable === 'number') guildIdentifiable = guildIdentifiable.toString()
            if (this.cache.has(guildIdentifiable) && !forceApi) resolve(this.cache.get(guildIdentifiable))
            else {
                for (const guild of this.cache) {
                    if (guild[1].name === guildIdentifiable && !forceApi) resolve(guild)
                }
                fetch('https://discord.com/api/guilds/' + new URLSearchParams(guildIdentifiable))
                    .then(res => res.json)
                    .then(res => {
                        this.cache.set(res.id, new Guild(res))
                    })
            }
        }
    )}

    /**
     * Ensures that the input guild is up-to-date and exists.
     * If the guild is fetched and not cached, emits "guildCreate" from this.client
     * @param {GuildResolvable} guild "A Guild, guild ID, or object that may be turned into a Guild"
     * @returns {Guild} "The Guild instance."
     * @private "Should only be called internally."
     */
    async updateCache(guild) {
        if (typeof guild === "string" || typeof guild === "number") guild = await fetch(guild)
        if (guild instanceof Guild) {
            this.cache.set(guild.id, guild)
        }
        else {
            if (!this.cache.has(guild.id)) {
                this.client.emit("guildCreate", guild)
            }
            this.cache.set(guild.id, new Guild(this.client, guild))
        }
        return this.cache.get(guild.id)
    }
}

module.exports = GuildManager