const Guild = require("../guild/Guild")
const Manager = require('./Manager')
const fetch = require('node-fetch')

class GuildManager extends Manager {
    /**
     * 
     * @param {Client} client 
     * @param {Array<GuildResolvable>} guilds 
     */
    constructor(client, guilds = []) {
        super(client, Guild, guilds)

        for (const g of guilds) this.updateCache(Guild.resolve(g, this.client))
    }

    /**
     * Searches for a guild.
     * @param {any} guildIdentifiable "The ID or name of a guild."
     * @param {Boolean} forceApi "Whether or not to skip the cache
     * @returns {Promise<Guild>} "The Guild instance."
     */
    fetch(guildIdentifiable, forceApi = false) {
        return new Promise((resolve, reject) => {
            if (typeof guildIdentifiable === 'number') guildIdentifiable = guildIdentifiable.toString()
            console.log("Does the guild have guild " + guildIdentifiable + "?", this.cache.has(guildIdentifiable))
            if (this.cache.has(guildIdentifiable) && !forceApi) resolve(this.cache.get(guildIdentifiable))
            else {
                for (const guild of this.cache) 
                    if (guild[1].name === guildIdentifiable && !forceApi) resolve(guild)
                
                fetch('https://discord.com/api/guilds/' + guildIdentifiable)
                    .then(res => res.json())
                    .then(res => {
                        this.cache.set(res.id, Guild.resolve(res, this.client))
                        resolve(this.cache.get(res.id))
                    }).catch(reject)
            }
        }
        )}
}

module.exports = GuildManager
