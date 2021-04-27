const Base = require('../Base')
class Channel extends Base {
    /**
     * 
     * @param {Client} client The client that instantiated this channel
     * @param {ChannelData} data The data for this channel
     */
    constructor(client, data) {
        super(client)
        
        /**
         * The channel type.
         * @readonly
         */
        this.type = ChannelTypes[data.type]

        /**
         * The channel id.
         * @readonly
         */
        this.id = data.id
    }

    /**
     * Any object that may be resolved into a channel.
     * @typedef {Object|Channel|Promise<Channel>|ChannelResolvable} ChannelResolvable
     */

    /**
     * Turns a ChannelResolvable object into a guild.
     * @method resolve
     * @returns {Channel}
     * @param {ChannelResolvable} resolvable The ChannelResolvable object to resolve
     */
    
    /**
     * Takes a Channel or ChannelResolvable object and uses it to return a Channel filled
     * to the highest possible extension.
     * @param {ChannelResolvable} completable Some object to fill out into a full channel
     */
    static compelete(completable) {
        if ('type' in completable)
            switch (completable.type) {
            default: return Channel.resolve(completable)
            case 0: return TextChannel.resolve(completable)
            case 1: return DMChannel.resolve(completable)
            case 2: return VoiceChannel.resolve(completable)
            case 3: return GroupChannel.resolve(completable)
            case 5: return NewsChannel.resolve(completable)
            }
        else {
            const err = new RangeError("Invalid completable object")
            err.completable = completable
            throw err
        }
    }

    /**
     * 
     * @param {Channel|string|number} identifiable The name, id, or object of a channel.
     * @param {Boolean} cache Whether or not to cache the object.
     * @param {Boolean} forceApi Whether or not to skip checking the cache and immediately call the API.
     * @returns 
     */
    fetch(cache = true, forceApi = false) {
        return new Promise((resolve, reject) => {
            if (this.client.channels.has(this.id) && !forceApi) 
                if (this.client.channels.get(this.id).instantiated >= this.instantiated && !forceApi) resolve(this.client.channels.get(this.id))
                else if (this.instantiated > this.client.channels.get(this.id) && !forceApi) {
                    if (cache) this.client.channels.updateCache(this)
                    resolve(this)
                } else 
                    fetch('https://discord.com/api/channels/' + new URLSearchParams(this.id))
                        .then(res => res.json())
                        .then(res => {
                            if (cache) {
                                this.cache.set(res.id, Channel.complete(res))
                                resolve(this.cache.get(res.id))
                            } else resolve(Channel.complete(res))
                        }).catch(reject)
            reject(new Error("Could not fetch?"))
        }
        )}

}

module.exports = Channel

const ChannelTypes = require('./ChannelTypes.js')
const DMChannel = require('./DMChannel.js')
const GroupChannel = require('./GroupChannel.js')
const NewsChannel = require('./NewsChannel.js')
const TextChannel = require('./TextChannel.js')
const VoiceChannel = require('./VoiceChannel.js')
