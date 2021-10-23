const Channel = require("../channel/Channel")
const Manager = require('./Manager')
const fetch = require('node-fetch')

class ChannelManager extends Manager {

    /**
     * A Manager for managing channels cached in the client
     * @param {Client} client
     * @param {Array<Object>} channels 
     */
    constructor(client, channels = []) {
        super(client, Channel, channels)

        /**
         * The cached channels.
         * @type {Map<Channel>}
         */
        this.cache = new Map()
        if (channels) for (const o of channels) this.updateCache(Channel.compelete(o, this.client))
    }

    /**
     * Searches for a channel.
     * @param {Channel|string|number} identifiable The name, id, or object of a channel.
     * @param {Boolean} cache Whether or not to cache the object.
     * @param {Boolean} forceApi Whether or not to skip checking the cache and immediately call the API.
     * @returns {Promise<Channel>}
     */
    fetch(identifiable, cache = true, forceApi = false) {
        return new Promise((resolve, reject) => {
            if (typeof identifiable === 'number') identifiable = identifiable.toString()
            if (this.cache.has(identifiable) && !forceApi) resolve(this.cache.get(identifiable))
            else {
                for (const chan of this.cache) 
                    if (chan[1].name === identifiable && !forceApi) resolve(chan)
                    
                fetch('https://discord.com/api/channels/' + identifiable)
                    .then(res => res.json())
                    .then(res => {
                        let completed = Channel.complete(res, this.client)
                        if (cache) {
                            this.cache.set(res.id, completed)
                            resolve(this.cache.get(res.id))
                        } else resolve(completed)
                    }).catch(reject)
            }
        }
        )}

}

module.exports = ChannelManager
