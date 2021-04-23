const Guild = require("./Guild")
const fetch = require('node-fetch')

class GuildManager {
    /**
     * 
     * @param {Client} client 
     * @param {Array<Object>} guilds 
     */
    constructor(client, guilds = []) {
        Object.defineProperty(this, 'client', { value: client })
        this.cache = new Map()
        for (const guild of guilds) {
            if (guild instanceof Guild) this.cache.set(guild.id, guild)
            else this.cache.set(guild.id, new Guild(this.client, guild))
        }
    }

    /**
     * Searches for a guild.
     * @param {any} guildIdentifiable "The ID or name of a guild."
     * @param {Boolean} forceApi "Whether or not to skip the cache
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
                    .then(res => res.json())
                    .then(res => {
                        this.cache.set(res.id, new Guild(res))
                        resolve(this.cache.get(res.id))
                    }).catch(reject)
            }
        }
    )}

    /**
     * Ensures that the input guild is up-to-date and exists.
     * If the guild is fetched and not cached, emits "guildCreate" from this.client
     * @param {GuildResolvable} guild "A Guild, guild ID, or object that may be turned into a Guild"
     * @returns {Promise<Guild>} "The Guild instance."
     * @private "Should only be called internally."
     */
    async updateCache(guild) {
        return new Promise((resolve, reject) => {
            try {
                if (typeof guild === "string" || typeof guild === "number") guild = await this.fetch(guild)
                if (guild instanceof Guild) {
                    this.cache.set(guild.id, guild)
                } else {
                    if (!this.cache.has(guild.id)) {
                        this.client.emit("guildCreate", guild)
                    }
                    this.cache.set(guild.id, new Guild(this.client, guild))
                }
                resolve(this.cache.get(guild.id))
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = GuildManager