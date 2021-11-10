const Guild = require("../guild/Guild")
const Manager = require('./Manager')
const fetch = require('node-fetch')

class GuildManager extends Manager {
    /**
     * A {@link Manager} for managing guilds cached in the client.
     * @param {Client} client The client this manager is attached to
     * @param {Array<GuildResolvable>} guilds An array of guild resolvables
     * @extends Manager
     */
    constructor(client, guilds = []) {
        super(client, Guild, guilds)

        for (const g of guilds) this.updateCache(Guild.resolve(g, this.client))
    }

    /**
     * Searches for a guild.
     * @param {any} guildIdentifiable The ID or name of a guild.
     * @param {Boolean} forceApi Whether or not to skip the cache
     * @returns {Promise<Guild>} The guild instance.
     */
    fetch(guildIdentifiable, forceApi = false) {
        return new Promise((resolve, reject) => {
            if (typeof guildIdentifiable === 'number') guildIdentifiable = guildIdentifiable.toString()
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

/**
 * An object which can be resolved to a guild
 * @typedef {Object} GuildResolvable
 */
