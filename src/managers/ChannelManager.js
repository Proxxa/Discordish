const Channel = require("../channel/Channel")
const Manager = require('./Manager')

class ChannelManager extends Manager {

    constructor(client, channels = []) {
        super(client, Channel, channels)

        /**
         * The cached channels.
         * @type {Map<Channel>} A map of channels.
         */
        this.cache = new Map()
        if (channels) for (const o of channels) this.updateCache(Channel.compelete(o))
    }

    /**
     * 
     * @param {Channel|string|number} identifiable The name, id, or object of a channel.
     * @param {Boolean} cache Whether or not to cache the object.
     * @param {Boolean} forceApi Whether or not to skip checking the cache and immediately call the API.
     * @returns 
     */
    fetch(identifiable, cache = true, forceApi = false) {
        return new Promise((resolve, reject) => {
            if (typeof identifiable === 'number') identifiable = identifiable.toString()
            if (this.cache.has(identifiable) && !forceApi) resolve(this.cache.get(identifiable))
            else {
                for (const channel of this.cache) 
                    if (channel[1].name === identifiable && !forceApi) resolve(channel)
                    
                fetch('https://discord.com/api/channels/' + new URLSearchParams(identifiable))
                    .then(res => res.json())
                    .then(res => {
                        if (cache) {
                            this.cache.set(res.id, Channel.complete(res))
                            resolve(this.cache.get(res.id))
                        } else resolve(Channel.complete(res))
                    }).catch(reject)
            }
        }
        )}

}

module.exports = ChannelManager
